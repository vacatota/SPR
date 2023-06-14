import { Atribucion } from './../../models/atribucion';
import { AtribucionService } from '../../services/atribucion.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-atribucion',
  templateUrl: './atribucion.component.html',
  styleUrls: ['./atribucion.component.css']
})

export class AtribucionComponent implements OnInit, OnDestroy {

  breadCrumbItems = [{label: 'Formulación'}, {label: 'Planes'}, {label: 'Atribuciones', active: true}];

  public formAtribucion!:UntypedFormGroup;
  public formSubmitted= false;
  public ipAddress!:string;
  public buffer:any;
  public currentAmbiente:any;
  public nombreUnidad!:any;
  public idSprAmbiente!:number;
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public dataApp: any[] = [];

  public nameModal: string = 'modalNewEdit'
  nameApp = 'Atribuciones';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

 @ViewChild(DataTableDirective, { static: false })
 dtElement: DataTableDirective;

 isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private atribucionService:AtribucionService,
    private alert:AlertService,
    private ip:IpPublicService,
    public modal: ModalService
    ) {
      this.buffer = localStorage.getItem('currentUser');
      this.currentAmbiente = JSON.parse(this.buffer); 
      this.nombreUnidad = this.currentAmbiente.nombreUnidad;
      this.selectItems = [
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Inactivo' },
      ];

      this.idSprAmbiente = this.currentAmbiente.idSprAmbiente;
    }

    get atribucionForm() {
      return this.formAtribucion.controls;
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
    this.formAtribucion = this.fb.group({
     idSprAtribucion: [],
     idSprAmbiente: [],
     nombre: ['',[Validators.required]],
     descripcion: [],
     estado: ['', [Validators.required]],
    });
    this.formAtribucion.patchValue({
      estado: this.selectItems[0].value,
    });
  }
  initApp() {
    this.listDataApp(this.idSprAmbiente);
    this.setDataTable();
    this.setForm(); 
    }  
  ngOnInit() {
    this.getIpPublic();
    this.initApp(); 
  }
  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
    this.ipAddress = res.ip;
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  listDataApp(idSprAmbiente:any){
    this.atribucionService.list('?idSprAmbiente=' + idSprAmbiente)
    .subscribe(resp => {
     this.dataApp = resp;
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
   this.formAtribucion.value.usuario = this.currentAmbiente.idSprUsuario;
   this.formAtribucion.value.ip = this.ipAddress;
   this.formAtribucion.value.nombre = this.formAtribucion.value.nombre.toUpperCase(); 
   this.formAtribucion.value.idSprAmbiente =this.currentAmbiente.idSprAmbiente;
  //this.formAtribucion.value.delLog = "N";
  if(!this.formAtribucion.invalid){
  if(this.formAtribucion.value.idSprAtribucion == null){
    this.atribucionService.create(this.formAtribucion.value)
    .subscribe( resp => {
      this.initApp();
      this.modal.close();
      this.alert.createOk();
    },
    (err) => {
      this.alert.createError();
    }
  );
}else{
  this.atribucionService.update(this.formAtribucion.value)
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
    }else{
      return;
}
}

      edit(obj:Atribucion){
        this.openModal();
        this.formAtribucion.patchValue({
        idSprAtribucion: obj.idSprAtribucion,
        idSprAmbiente: obj.idSprAmbiente,
        nombre: obj.nombre,
        descripcion: obj.descripcion,
        estado: obj.estado,
        });
     }

 

  delete(idRegister:number){
    this.modal.open('delete-atribucion');
   this.idDeleteRegister= idRegister;
  }
  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.atribucionService.delete(      
        {"idSprAtribucion":this.idDeleteRegister, 
        "usuario":this.currentAmbiente.idSprUsuario, 
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
    
  // Modal Crear/editar
  openModal(){
    this.onResetForm();
    this.modal.open(this.nameModal);
      }
       
// Resetear el formulario
    //################################################
    onResetForm() {
      this.formSubmitted = false;
      this.formAtribucion.reset();
  }
}


