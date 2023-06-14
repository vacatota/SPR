
import { Hito } from '../../../models/hito';
import { HitoService } from '../../../services/hito.service';
import { IpPublicService } from '../../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, FormArray, FormControl } from '@angular/forms';
import { AlertService } from '../../../../../services/alert.service';
import { ModalService } from '../../../../../services/modal.service';
import { DataTableDirective } from 'angular-datatables';
import { ProyectoService } from '../../../services/proyecto.service';
import { ComunService } from 'src/app/modulos/catalogos-proces/services/comun.service';
import { EspecialUnoService } from 'src/app/modulos/catalogos-proces/services/especial-uno.service';
import { Subject, forkJoin, mergeMap } from 'rxjs';

@Component({
  selector: 'app-hito',
  templateUrl: './hito.component.html',
  styleUrls: ['./hito.component.css']
})
export class HitoComponent implements OnInit, OnDestroy {
  public formHito: UntypedFormGroup;
  public formSubmitted = false;
  public currentAmbiente: any;
  public ipAddress!: string;
  public buffer: any;
  public dataHito: any[] = [];
  public dataCatHito!: any;
  public dataEtapas!: any;
  public dataProyecto!: any;
  public dataHitoProyecto!: any;
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public selectItems1: any[] = [];
  public nameModalHito: string = 'hito-proyecto'
  public nameApp = '';
  public idSprAmbiente!: number;
  public idRecursivoCat: number = 242;
  public idRecursivoEtapas: number = 113;
  public idSprProyecto!: 0;
  public nombreCategoria!: any;
  public dataSource: any = [];
  public calificacionTotal!: any;
  edit: boolean = false;
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @Input() set data(hitoProyect: any) {
    this.idSprProyecto = hitoProyect.idSprProyecto;
    this.nameApp = hitoProyect.nombre;
    console.log('idSprProyecto: ', this.idSprProyecto );
    this.initApp(); 
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private hitoService: HitoService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService,
    private proyectoService: ProyectoService,
    private comunService: ComunService,
    private especialUnoService: EspecialUnoService,
  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.currentAmbiente = JSON.parse(this.buffer);
    this.selectItems = [
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];

    this.selectItems1 = [
      { value: 1, label: 'Si' },
      { value: 2, label: 'No' },
    ];
  }

  get hitoForm() {
    return this.formHito.controls;
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
    this.formHito = this.fb.group({
      idSprHito: [],
      idSprProyecto: [this.idSprProyecto],
      nombre: ['', [Validators.required]],//
      idSprCategoriaHitos: ['', [Validators.required]],
      idSprEtapaProyecto: ['', [Validators.required]],
      maximoHito: ['', [Validators.required]],
      pesoHito: ['', [Validators.required]],
      fechaComprometida: [],
      fechaEstimada: [],
      fechaReal: [],
      cumplimientoHito: [],
      avance: [],
      estado: ['', [Validators.required]],
    });
  }

  initApp() {
    this.listDataHito(this.idSprProyecto);
    this.listProyecto(this.idSprAmbiente);
    this.setDataTable();
    this.setForm();
    this.getIpPublic();
    this.listCatHito();
    this.listEtapa();
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

  onSubmitHito() {
    this.formSubmitted = true;
    this.formHito.value.idSprProyecto = this.idSprProyecto;
    this.formHito.value.usuario = this.currentAmbiente.idSprUsuario;
    this.formHito.value.ip = this.ipAddress;
    this.formHito.value.nombre = this.formHito.value.nombre.toUpperCase();
    this.calificacionTotal = this.pesoHitoCalculo();
    if (this.formHito.valid) {
      //Realizar el posteo
      
      if (this.formHito.value.idSprHito == null || this.formHito.value.idSprHito == " ") {
        this.hitoService.create(this.formHito.value)
        .subscribe(resp => {
          this.closeModalHito();
          this.alert.createOk();
          this.initApp();
        },
        (err) => {
          this.alert.createError();
        }
        );
      } else {
        this.hitoService.update(this.formHito.value)
        .subscribe(resp => {
          this.closeModalHito();
          this.alert.updateOk();
          this.initApp();
        },
        (err) => {
          this.alert.updateError();
        }
      );
    }
    return true;
  } else {
    //console.log('Formulario invalido: ', );
    return false;
  }
}
  
  update(obj: Hito) {
    this.edit = true;
    this.openModalHito();
    
    this.formHito.patchValue({
      idSprHito: obj.idSprHito,
      idSprProyecto: obj.idSprProyecto,
      idSprCategoriaHitos: obj.idSprCategoriaHitos,
      idSprEtapaProyecto: obj.idSprEtapaProyecto,
      nombre: obj.nombre,
      maximoHito: obj.maximoHito,
      pesoHito: obj.pesoHito,
      fechaComprometida: obj.fechaComprometida,
      fechaEstimada: obj.fechaEstimada,
      fechaReal: obj.fechaReal,
      cumplimientoHito: obj.cumplimientoHito,
      avance: obj.avance,
      estado: obj.estado,
    });
    
  }
  
  ///////////////TRAE DATOS DE PROYECTOS/////////////////
  listProyecto(idSprAmbiente: any) {
    this.proyectoService.list('?idSprAmbiente=' + idSprAmbiente)
    .subscribe(resp => {
      this.dataProyecto = resp;
      //console.log("proyectos",this.dataProyecto)
      this. listDataHito(this.idSprAmbiente);
    })
  }
  ////////////////////TRAE DATOS DE HITOS//////////////
  listDataHito(idSprProyecto: any) {
    this.hitoService.list('?idSprProyecto='+idSprProyecto)
    .subscribe(resp => {
      this.dataHito = resp;
      console.log("data hitos:",this.dataHito)
      //this.listProyecto(this.idSprAmbiente);
      this.reDrawDataTable();
    })
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

  //################################################
  //TRAE DATOS DEL CATALOGO COMUN CATEGORIA DE HITO
  //################################################
  listCatHito() {
    this.comunService.list()
      .subscribe(resp => {
        this.dataCatHito = this.getDataDependiente(resp, this.idRecursivoCat);
        this.mapearDataCategoria()
      })
  }

  mapearDataCategoria() {
    for (let i = 0; i < this.dataHito.length; i++) {
      for (let j = 0; j < this.dataCatHito.length; j++) {
        if ((this.dataHito[i].idSprComun === this.dataCatHito[j].idSprCategoriaHitos)) {
          this.dataHito[i].categoria = this.dataCatHito[j].nombre;
        }
      }
    }
    this.nombreCategoria = 
    console.log('nombre categoria: ', this.dataCatHito);
  }
  //##############################
  //DEPENDIENTE DEL CATALOGO COMUN
  //##############################
  getDataDependiente(dataObj: any, spr_idSprComun: any = null) {
    let stateOptionTipo = false;

    let dependientes: any = [];
    dataObj.forEach((row: any) => {

      if (row.spr_idSprComun == spr_idSprComun) {
        dependientes.push(
          {
            idSprComun: row.idSprComun,
            nombre: row.nombre,
            descripcion: row.descripcion,
            spr_idSprComun: row.spr_idSprComun,
            estado: row.estado,

          });
      }
    });
    return dependientes;
  }


  //################################################
  //TRAE DATOS DEL CATALOGO ESPECIAL UNO ETAPA DE PROYCTO
  //################################################
  listEtapa() {
    this.especialUnoService.list()
      .subscribe(resp => {
        this.dataEtapas = this.getDataDependienteEsp(resp, this.idRecursivoEtapas);
        console.log("etapas de proyecto",this.dataEtapas)
      })
  }
  //##############################
  //DEPENDIENTE DEL CATALOGO ESPECIAL UNO
  //##############################
  getDataDependienteEsp(dataEtapa: any, spr_idSprEspecialUno: any = null) {
    let stateOptionTipo = false;

    let dependiente: any = [];
    dataEtapa.forEach((row: any) => {

      if (row.spr_idSprEspecialUno == spr_idSprEspecialUno) {
        dependiente.push(
          {
            idSprEspecialUno: row.idSprEspecialUno,
            nombre: row.nombre,
            descripcion: row.descripcion,
            ponderacion: row.ponderacion,
            spr_idSprEspecialUno: row.spr_idSprEspecialUno,
            estado: row.estado,
            
          });//console.log("ponderacion hito",row.ponderacion)
      }
    });
    return dependiente;

  }
  pesoHitoCalculo() {
    let idRecursivoEtapas: any;
    let maximoHito: any;
    let totalCalificacion: any;

    idRecursivoEtapas = this.formHito.value.idRecursivoEtapas;
    maximoHito = this.formHito.value.maximoHito;
    totalCalificacion = idRecursivoEtapas / maximoHito;
   console.log("ponderacion",idRecursivoEtapas)
    return totalCalificacion;
  }

  delete(idRegister: number) {
    this.modal.open('delete-hito');
    this.idDeleteRegister = idRegister;
  }
  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.hitoService.delete(
        {
          "idSprHito": this.idDeleteRegister,
          "usuario": this.currentAmbiente.idSprUsuario,
          "delLog": "S",
          "ip": this.ipAddress
        }
      )
        .subscribe(resp => {
          this.initApp();
          this.modal.closeId('delete-hito')
          this.alert.deleteOk();
        }, (err) => {
          this.alert.deleteError();
        });
    }
  }

  
  // Modal Crear/editar
  openModalHito() {
    this.onResetForm();
    this.modal.open(this.nameModalHito);
    
  }

  //#######################
  //RESETEA EL FORMULARIO//
  //#######################
  onResetForm() {
    this.formSubmitted = false;
    this.formHito.reset();
  }

  closeModalHito(){
   
    this.modal.closeId('hito-proyecto');
    }
    nodeSelect(evt) {
      this.formHito.patchValue({
        idSprEtapaProyecto: evt.node.data,
        maximoHito: evt.node.label
      });
    }
}