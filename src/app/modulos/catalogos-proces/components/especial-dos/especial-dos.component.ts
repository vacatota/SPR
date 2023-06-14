import { EspecialDos } from '../../models/especial-dos';
import { EspecialDosService } from '../../services/especial-dos.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, FormGroup } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-especial-dos',
  templateUrl: './especial-dos.component.html',
  styleUrls: ['./especial-dos.component.css']
})
export class EspecialDosComponent implements OnInit, OnDestroy {

  breadCrumbItems = [{label: 'Administración Procesos'}, {label: 'Catálogos'}, {label: 'Especial Dos', active: true}];

  public formEspecialDos!: UntypedFormGroup;
  public formSelectCatalogo!: FormGroup;
  public submitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataApp: any[] = [];
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameUnidad!: any;
  fathers: any = [];
  publicpp!: any;
  public dataViewTable!: any;
  selectedOptionRecursivo: any = null;

  public nameModal: string = 'modalNewEdit'
  public nameApp = 'Catálogo Especial Dos';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private especialDosService: EspecialDosService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService
  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.selectItems = [
      { value: '', label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];

  }

  get rolForm() {
    return this.formEspecialDos.controls;
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
    this.listDataApp();
    this.formEspecialDos = this.fb.group({
      idSprEspecialDos: [],
      spr_idSprEspecialDos: [],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      formula: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
    this.formSelectCatalogo = this.fb.group({
      spr_idSprEspecialDos: [0],
    });
  }

  initApp() {
    this.listDataApp();
    this.setDataTable();
    this.setForm();
  }
  ngOnInit(): void {
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

  onSubmit() {
    this.submitted = true;
    this.formEspecialDos.value.usuario = this.currentUser.idSprUsuario;
    this.formEspecialDos.value.ip = this.ipAddress;
    this.formEspecialDos.value.nombre = this.formEspecialDos.value.nombre.toUpperCase();
    this.selectedOptionRecursivo = this.formEspecialDos.value.spr_idSprEspecialDos;
    console.log("formEspecial", this.formEspecialDos.value)
    
      console.log("formEspecial", this.formEspecialDos.value)
      if (this.formEspecialDos.value.idSprEspecialDos == null) {
        this.especialDosService.create(this.formEspecialDos.value).subscribe(
          (resp) => {
            this.initApp();
            this.modal.close();
            this.alert.createOk();
          },
          (err) => {
            this.alert.createError();
          }
        );
      } else {
        this.especialDosService.update(this.formEspecialDos.value).subscribe(
          (resp) => {
            this.initApp();
            this.modal.close();
            this.alert.updateOk();
          },
          (err) => {
            this.alert.updateError();
          }
        );
      }
  }

  edit(obj: EspecialDos) {
    this.openModal();
    this.formEspecialDos.patchValue({
      idSprEspecialDos: obj.idSprEspecialDos,
      spr_idSprEspecialDos: obj.spr_idSprEspecialDos,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      formula: obj.formula,
      estado: obj.estado
    });
  }

  delete(idRegister: number) {
    this.modal.open('delete-especialDos');
    this.idDeleteRegister = idRegister;
  }

  confirmDelete() {
    console.log("prueba de borrado", this.idDeleteRegister)
    if (this.idDeleteRegister > 0) {
      this.especialDosService.delete(
        {
          "idSprEspecialDos": this.idDeleteRegister,
          "usuario": this.currentUser.idSprUsuario,
          "delLog": "S",
          "ip": this.ipAddress
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

  listDataApp() {
    this.especialDosService.list()
      .subscribe((resp) => {
        this.dataApp = resp;
        this.getDataDependiente(this.selectedOptionRecursivo);
        //this.reDrawDataTable();  
        this.dataApp = resp;
              
      });
    return true;
  }
  /* getDataBack() {
     this.especialDosService.list()
       .subscribe(resp => {
         thispp = resp;
         this.getDataDependiente(this.selectedOptionRecursivo)
         thispp = resp;
       });
     return true;
   }*/

  cargarCatalogoDependiente() {
    console.log("Data dependientes: ", this.selectedOptionRecursivo)
    if (this.selectedOptionRecursivo > 0) {
      this.getDataDependiente(this.selectedOptionRecursivo);
    } else {
      this.dataViewTable = this.fathers;
    }
  }

  getDataDependiente(spr_idSprEspecialDos: any = null) {
    let stateOptionTipo = false;
    let father = "N/A";
    let dataAllProcesar = this.dataApp;
    let dependientes: any = [];
    dataAllProcesar.forEach((row: any) => {
      if (!stateOptionTipo && spr_idSprEspecialDos != null) {
        father = (row.idSprEspecialDos == spr_idSprEspecialDos) ? row.nombre : "";
        if (father != "") { stateOptionTipo = true; }
      }
      if (row.spr_idSprEspecialDos == spr_idSprEspecialDos) {
        dependientes.push(
          {
            idSprEspecialDos: row.idSprEspecialDos,
            nombre: row.nombre,
            descripcion: row.descripcion,
            formula: row.formula,
            spr_idSprEspecialDos: row.spr_idSprEspecialDos,
            estado: row.estado,
            tipo: father,
          });
      }
    });
    if (spr_idSprEspecialDos == null || spr_idSprEspecialDos == 0) {
      this.dataViewTable = dependientes
      this.fathers = dependientes
    } else {
      this.dataViewTable = dependientes
    }
  }

  openModal() {
    this.onResetForm();
    this.modal.open(this.nameModal);
  }

  onResetForm() {
    this.submitted = false;
    this.formEspecialDos.reset();
  }
}
