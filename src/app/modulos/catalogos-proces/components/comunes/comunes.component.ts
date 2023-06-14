import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { IpPublicService } from '../../../../services/ip-public.service';
import { ModalService } from '../../../../services/modal.service';
import { AlertService } from '../../../../services/alert.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ComunService } from '../../services/comun.service';

@Component({
  selector: 'app-comunes',
  templateUrl: './comunes.component.html',
  styleUrls: ['./comunes.component.scss']
})
export class ComunesComponent implements OnInit, OnDestroy {

  breadCrumbItems = [{label: 'Administración Procesos'}, {label: 'Catálogos'}, {label: 'Común', active: true}];

  public mostrarModal: boolean = false;
  public dataViewTable!: any;
  public dataAll!: any;
  public submitted = false;
  public formComun!: UntypedFormGroup;
  public formSelectCatalogo!: UntypedFormGroup;
  selectedOptionRecursivo: any = null;
  selectedOptionState: number = 0;
  selectedSprComun: number = 0;
  filtroPost = ''; //para la clase filtro
  fathers: any = [];
  buffer!: any;
  currentUser!: any

  public selectItems: any[] = [];
  public ipAddress!: string;
  public nameModal: string = 'modalNewEdit'
  private idDeleteRegister: number = 0;
  public selectMain: any[] = [];

  nameApp = 'Catálogo Común';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;


  constructor(
    private fb: FormBuilder,
    private ip: IpPublicService,
    private comunService: ComunService,
    private alert: AlertService,
    public modal: ModalService
  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
  }



  get comunForm() {
    return this.formComun.controls;
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
  ngOnInit() {
    this.getIpPublic();
    this.initApp();

  }


  initApp() {
    this.listDataApp(0);
    this.setDataTable();
    this.setForm();
  }

  listDataApp(idDependiente: number = 0) {
    if (idDependiente == 0) {
      this.comunService.list().subscribe(resp => {
        this.dataAll = resp;
        console.log('Data Main: ', this.dataAll);
        this.getDataDependiente(this.selectedOptionRecursivo)
        //this.setSelectMain();
        this.setSelectCatalogoPadre(" ");
        this.reDrawDataTable();

      });
    } else {
      //this.setSelectMain();
      this.getDataDependiente(idDependiente);
      this.reDrawDataTable();
    }
    //console.log("All Data2: ",this.dataAll)
    return true;
  }


  
  setSelectMain() {
    this.selectMain = [];
    console.log('Father select: ', this.fathers);
    this.selectMain.push({ idSprComun: " ", nombre: "Seleccione..." });
    for (let i = 0; i < this.fathers.length; i++) {
      if (this.fathers[i].spr_idSprComun = " ") {
        this.selectMain.push({ idSprComun: this.fathers[i].idSprComun, nombre: this.fathers[i].nombre });
      }
    }
    console.log('Seleccionar tipoCatalogo: ', this.selectMain);
    this.selectItems = [
      { value: " ", label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
  }


  setForm() {
    this.formComun = this.fb.group({
      idSprComun: [],
      spr_idSprComun: ['', []],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      estado: ['', [Validators.required]],
    });

    this.formSelectCatalogo = this.fb.group({
      spr_idSprComun: ['', []],
    });
  }

  setSelectCatalogoPadre(idSelect: string = " ") {
    this.formSelectCatalogo = this.fb.group({
      spr_idSprComun: [idSelect, []],
    });

     this.formComun = this.fb.group({
      idSprComun: [],
      spr_idSprComun: [idSelect, []],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      estado: [idSelect, [Validators.required]],
    });
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

  cargarCatalogoDependiente() {
    if(this.selectedOptionRecursivo != " "){ this.listDataApp(this.selectedOptionRecursivo)};
  }


  getDataDependiente(spr_idSprComun: any = null) {
    this.comunService.list().subscribe(resp => {
      this.dataAll = resp;
      let stateOptionTipo = false;
      let father = "N/A";
      let dataAllProcesar = this.dataAll;
      let dependientes: any = [];
      dataAllProcesar.forEach((row: any) => {
        if (!stateOptionTipo && spr_idSprComun != null) {
          father = (row.idSprComun == spr_idSprComun) ? row.nombre : "";
          if (father != "") { stateOptionTipo = true; }
        }
        if (row.spr_idSprComun == spr_idSprComun) {
          dependientes.push(
            {
              idSprComun: row.idSprComun,
              nombre: row.nombre,
              descripcion: row.descripcion,
              spr_idSprComun: row.spr_idSprComun,
              estado: row.estado,
              tipo: father,
            });
        }
      });

      console.log('Data procesada: ', dependientes);
      if (spr_idSprComun == null || spr_idSprComun == 0) {
        this.dataViewTable = dependientes
        this.fathers = dependientes
        console.log('Data si: ',);
        this.setSelectMain();
      } else {
        this.dataViewTable = dependientes
        ///this.reDrawDataTable();
      }
    });
  }

  // Modal Crear/editar
  closeModal() {
    this.onResetForm();
    return this.modal.close();
  }

  onSubmit() {
    this.submitted = true;
    this.formComun.value.usuario = this.currentUser.idSprUsuario;
    this.formComun.value.ip = this.ipAddress;
    this.formComun.value.nombre = this.formComun.value.nombre.toUpperCase();
    this.formComun.value.delLog = "N";
    console.log('[INFO] Create form:', this.formComun.value);
    //if (!this.formComun.invalid) {
    this.selectedOptionRecursivo = this.formComun.value.spr_idSprComun;
    //Realizar el posteo
    if (this.formComun.value.idSprComun == null) {
      this.comunService.create(this.formComun.value)
        .subscribe(resp => {
          this.listDataApp(this.selectedOptionRecursivo);
          this.setSelectCatalogoPadre(this.selectedOptionRecursivo);
          this.alert.createOk()
          this.closeModal();
        }, (err) => {
          this.alert.createError();
        });
    } else {
      this.comunService.update(this.formComun.value)
        .subscribe(resp => {
          this.setSelectCatalogoPadre(this.selectedOptionRecursivo);
          this.listDataApp(this.selectedOptionRecursivo);
          this.closeModal();
          this.alert.updateOk();
        }, (err) => {
          this.alert.updateError();
        });
    }
  }

  edit(obj: any) {
    this.openModal();
    console.log('Editar: ', obj);
    this.formComun.patchValue({
      idSprComun: obj.idSprComun,
      spr_idSprComun: obj.spr_idSprComun,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      estado: obj.estado
    });
  }



  delete2(id: number) {
    //console.log("metodo borrar/id: ",id)


    this.comunService.delete(
      {
        "idSprComun": id,
        "usuario": this.currentUser.idSprUsuario,
        "delLog": "S",
        "ip": this.ipAddress
      })
      .subscribe(resp => {
        this.listDataApp();
        this.getDataDependiente(this.selectedOptionRecursivo);
        this.alert.deleteOk();
      }, (err) => {
        this.alert.deleteError();
      });

  }

  delete(idRegister: number) {
    this.modal.open('delete-comun');

    this.idDeleteRegister = idRegister;
  }

  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.comunService.delete(
        {
          "idSprComun": this.idDeleteRegister,
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

  openModal() {
    this.onResetForm();
    this.modal.open(this.nameModal);
  }


  // Resetear el formulario
  //################################################
  onResetForm() {
    this.formComun.reset();
    this.submitted = false;
  }
}


