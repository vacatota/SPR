import { EspecialUno } from '../../models/especial-uno';
import { EspecialUnoService } from '../../services/especial-uno.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, FormGroup } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-especial-uno',
  templateUrl: './especial-uno.component.html',
  styleUrls: ['./especial-uno.component.css']
})
export class EspecialUnoComponent implements OnInit, OnDestroy {

  breadCrumbItems = [{label: 'Administración Procesos'}, {label: 'Catálogos'}, {label: 'Especial Uno', active: true}];

  public formEspecialUno!: UntypedFormGroup;
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
  nameApp = 'Catálogo Especial Uno';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private especialUnoService: EspecialUnoService,
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
    return this.formEspecialUno.controls;
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
    this.formEspecialUno = this.fb.group({
      idSprEspecialUno: [],
      spr_idSprEspecialUno: [],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      ponderacion: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
    this.formSelectCatalogo = this.fb.group({
      spr_idSprEspecialUno: [0],
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
    this.formEspecialUno.value.usuario = this.currentUser.idSprUsuario;
    this.formEspecialUno.value.ip = this.ipAddress;
    this.formEspecialUno.value.nombre = this.formEspecialUno.value.nombre.toUpperCase();
    this.selectedOptionRecursivo = this.formEspecialUno.value.spr_idSprEspecialUno;
    console.log("formEspecial", this.formEspecialUno.value)

      console.log("formEspecial", this.formEspecialUno.value)
      if (this.formEspecialUno.value.idSprEspecialUno == null) {
        this.especialUnoService.create(this.formEspecialUno.value).subscribe(
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
        this.especialUnoService.update(this.formEspecialUno.value).subscribe(
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

  edit(obj: EspecialUno) {
    this.openModal();
    this.formEspecialUno.patchValue({
      idSprEspecialUno: obj.idSprEspecialUno,
      spr_idSprEspecialUno: obj.spr_idSprEspecialUno,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      ponderacion: obj.ponderacion,
      estado: obj.estado
    });
  }

  delete(idRegister: number) {
    this.modal.open('delete-especialUno');
    this.idDeleteRegister = idRegister;
  }

  confirmDelete() {
    console.log("prueba de borrado", this.idDeleteRegister)
    if (this.idDeleteRegister > 0) {
      this.especialUnoService.delete(
        {
          "idSprEspecialUno": this.idDeleteRegister,
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
    this.especialUnoService.list()
      .subscribe((resp) => {
        this.dataApp = resp;
        this.getDataDependiente(this.selectedOptionRecursivo);
        //this.reDrawDataTable();
        this.dataApp = resp;

      });
    return true;
  }
  /* getDataBack() {
     this.especialUnoService.list()
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

  getDataDependiente(spr_idSprEspecialUno: any = null) {
    let stateOptionTipo = false;
    let father = "N/A";
    let dataAllProcesar = this.dataApp;
    let dependientes: any = [];
    dataAllProcesar.forEach((row: any) => {
      if (!stateOptionTipo && spr_idSprEspecialUno != null) {
        father = (row.idSprEspecialUno == spr_idSprEspecialUno) ? row.nombre : "";
        if (father != "") { stateOptionTipo = true; }
      }
      if (row.spr_idSprEspecialUno == spr_idSprEspecialUno) {
        dependientes.push(
          {
            idSprEspecialUno: row.idSprEspecialUno,
            nombre: row.nombre,
            descripcion: row.descripcion,
            ponderacion: row.ponderacion,
            spr_idSprEspecialUno: row.spr_idSprEspecialUno,
            estado: row.estado,
            tipo: father,
          });
      }
    });
    if (spr_idSprEspecialUno == null || spr_idSprEspecialUno == 0) {
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
    this.formEspecialUno.reset();
  }
}
