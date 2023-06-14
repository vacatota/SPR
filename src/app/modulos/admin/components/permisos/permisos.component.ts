import { Permiso } from './../../models/permiso';
import { PermisoService } from '../../services/permiso.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators,FormGroup, UntypedFormGroup } from '@angular/forms';
import { IpPublicService } from '../../../../services/ip-public.service';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})
export class PermisosComponent implements OnInit, OnDestroy {

  breadCrumbItems = [{label: 'Administración Sistema'}, {label: 'Catálogos'}, {label: 'Permisos', active: true}];

  public formPermiso!:UntypedFormGroup;
  public formSubmitted= false;
  public ipAddress!:string;
   public idSprUsuario!:number;
   private buffer!:any;
   private currentUser!:any;
   private idDeleteRegister: number = 0;
   public selectItems: any[] = [];
   public dataPermiso: any[] = [];
   public nameModal: string = 'modalNewEdit'
   public nameApp = 'Permisos';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private permisoService:PermisoService,
    private alert:AlertService,
    private ip:IpPublicService,
    public modal: ModalService
    ) {
      this.buffer = localStorage.getItem('currentUser');
      this.currentUser = JSON.parse(this.buffer);
      this.selectItems = [
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Inactivo' },
      ];
    }
     // this.paginator.itemsPerPageLabel = "Registros por página";

     get permisoForm() {
      return this.formPermiso.controls;
    }
    setDataTable() {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        destroy: true,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        },
      };
    }

    setForm() {
    this.formPermiso = this.fb.group({
      idSprPermiso: [],
     nombre: ['',[Validators.required]],
     descripcion: [],
     estado: ['', [Validators.required]],
    });
    this.formPermiso.patchValue({
      estado: this.selectItems[0].value,
    });
  }
  initApp() {
    this.listDataPermiso();
    this.setDataTable();
    this.setForm(); 
    }
  ngOnInit(): void {
    this.getIpPublic();
    this.initApp();  
  }  
getIpPublic(){  
    this.ip.getIPAddress().subscribe((res:any)=>{  
      this.ipAddress=res.ip;  
        });  

    
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  listDataPermiso() {
    this.permisoService.list().subscribe((resp) => {
      this.dataPermiso = resp;
      this.reDrawDataTable();
    });
  }

  reDrawDataTable() {
    // Redibujar la tabla al actualizar datos
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next(null);
    }
  }

  onSubmit(){
  this.formSubmitted=true;
    this.formPermiso.value.usuario = this.currentUser.idSprUsuario;
    this.formPermiso.value.ip =this.ipAddress;
    this.formPermiso.value.nombre = this.formPermiso.value.nombre.toUpperCase(); 
    if(!this.formPermiso.invalid){
if(this.formPermiso.value.idSprPermiso == null){
  this.permisoService.create(this.formPermiso.value)
  .subscribe( (resp) => {
    this.initApp();
    this.modal.close();
    this.alert.createOk();
  },
  (err) => {
    this.alert.createError();
  }
);
} else {
  this.permisoService.update(this.formPermiso.value)
  .subscribe((resp) => {
    this.initApp();
    this.modal.close();
    this.alert.updateOk();
  },
  (err) => {
    this.alert.updateError();
  }
);
}
} else {
return;
}
}

edit(obj:Permiso){
        this.openModal();
        this.formPermiso.patchValue({
          idSprPermiso: obj.idSprPermiso,
          nombre: obj.nombre,
          descripcion:obj.descripcion,
          estado: obj.estado
        });
     }

  
  delete(idRegister:number){
    console.log("delete",idRegister)
    this.modal.open('delete-permisos');
   this.idDeleteRegister= idRegister;
  }
  
  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.permisoService.delete(      
        {"idSprPermiso":this.idDeleteRegister, 
        "usuario":this.currentUser.idSprUsuario, 
        "delLog":"S",
        "ip":this.ipAddress
      }     
      )
        .subscribe(resp => {
          this.initApp();
          this.modal.close()   
         this.alert.deleteOk(); 
        }, (err) => {
          this.alert.deleteError();        
        });
      }
  }

  //mayusculas(nombreMayus: any = "gggggggggg") {
    //nombreMayus.value = nombreMayus.value.toUpperCase();
    //console.log("aaaaaaaaaaaaaaa",nombreMayus.value)
//}

  openModal(){
    this.onResetForm();
    this.modal.open(this.nameModal);
      }
      
// Resetear el formulario
    //################################################
    onResetForm() {
      this.formSubmitted = false;
      this.formPermiso.reset();
  }
  //pageSize: number = 5;
 // pageNumber = 1;
  //pageSizeOptions = [5, 10, 25, 100];

}