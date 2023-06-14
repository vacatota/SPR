import { UmbralesService } from '../../../../../catalogos-proces/services/umbrales.service';
import { ConfiguracionIndicadores } from '../../../../models/configuracionIndicadores';
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import { AlertService } from '../../../../../../services/alert.service';
import { IndicadoresService } from '../../../../services/indicadores.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfiguracionIndicadoresService } from '../../../../services/configuracion-indicadores.service';
import { EspecialUnoService } from 'src/app/modulos/catalogos-proces/services/especial-uno.service';
import { EspecialDosService } from 'src/app/modulos/catalogos-proces/services/especial-dos.service';
import { ComunService } from 'src/app/modulos/catalogos-proces/services/comun.service';

@Component({
  selector: 'app-config-indicador-objetivo',
  templateUrl: './config-indicador-objetivo.component.html',
  styleUrls: ['./config-indicador-objetivo.component.css']
})
export class ConfigIndicadorObjetivoComponent {
  public formConfiguracionIndicadores!: UntypedFormGroup;
  public formSubmitted = false;
  public currentAmbiente: any;
  public ipAddress!: string;
  public buffer: any;
  public dataConfiguracionIndicadores: any[] = [];
  public modalElementos: boolean = false;
  public dataIndicadores!: any;// trae data de objetivos
  public dataUmbrales!: any;// trae data de objetivos
  public dataAreas!: any;// trae data de areas del Ambiente
  public dataEquipoGerencial!: any;
  public dataCatEspecialUno!: any;// trae data catalogo comun
  public dataJerarquia!: any;// trae data catalogo especial uno Jeraquia
  public dataTipoIndicador!: any;// trae data catalogo especial uno Jeraquia
  public dataUnidadMedida!: any;// trae data catalogo especial uno Jeraquia
  public dataFrecuencia!: any;// trae data catalogo especial uno Jeraquia
  public dataExpresion!: any;// trae data catalogo comun Expresion
  public dataComportamiento!: any;// trae data catalogo comun Comportamiento
  public dataEstrategiasMain!: any;// trae data de estrategias
  public nombreUnidad!: any;
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameModal: string = 'modalNewEdit'
  public nameModal1: string = 'modalNewEdit1'
  public rangoTotal!: any;
  nameApp = ' Configuración - Indicadores';
  idSprAmbiente!: number;
  public idSprNivelN1: number = 287;
  public nivelSelect!: number;
  idRecursivoComportamiento: number = 301;
  idRecursivoJerarquia: number = 98;
  idRecursivoTipoIndicador: number = 94;
  idRecursivoExpresion: number = 304;
  idRecursivoFrecuencia: number = 297;
  idRecursivoUnidadMedida: number = 123;
  idSprIndicador:number = 0;
  public idProceso!: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  @Input() set init(configuracionObj:any) {
    this.idSprIndicador = configuracionObj.idSprIndicador;
    this.nameApp = configuracionObj.nombre;
    console.log('idSprIndicador: ', this.idSprIndicador );
    this.initApp();
   }

  constructor(
    private fb: FormBuilder,
    private configuracionIndicadoresService: ConfiguracionIndicadoresService,
    private indicadoresService: IndicadoresService,
    private alert: AlertService,
    private ip:IpPublicService,
    public modal: ModalService,
     private comunService: ComunService,
    private especialUnoService: EspecialUnoService,
    private especialDosService: EspecialDosService,
    private umbralesService: UmbralesService,
  )
  {
    this.buffer = localStorage.getItem('currentUser');
    this.currentAmbiente = JSON.parse(this.buffer);
    this.nombreUnidad = this.currentAmbiente.nombreUnidad;
    this.selectItems = [
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
    this.idSprAmbiente = this.currentAmbiente.idSprAmbiente;
    }

    get procesoForm() {
      return this.formConfiguracionIndicadores.controls;
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
    this.formConfiguracionIndicadores = this.fb.group({
      idSprConfigIndicador: ['', [Validators.required]],
      idSprIndicador: [this.idSprIndicador],
      idSprUnidadMedida: [],
      idSprUmbral: [],
      idSprComportamiento: [],
      idSprExpresion: [],
      idSprFrecuencia: [],
      idSprJerarquia: [],
      idSprTipoIndicador: [],
      fechaInicio: [],
      lineaBase: ['', [Validators.required]],
      informacionFormula: ['', [Validators.required]],
      metaPeriodo: ['', [Validators.required]],
      numerador: [],
      denominador: ['', [Validators.required]],
      respaldoPdf: ['', [Validators.required]],
      comentario: ['', [Validators.required]],
      mayorIgual: ['', [Validators.required]],
      rangoIntermedio: ['', [Validators.required]],
      menorIgual: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
  }

  initApp() {
    this.listConfiguracionIndicadores(this.idSprIndicador);
    this.setDataTable();
    this.setForm();
    this.listComportamiento();
    this.listFrecuencia();
    this.listJerarquia();
    this.listUnidadMedida();
    this.listTipoIndicador();
    this.listUmbrales();
    this.listExpresion();
    this.listIndicadores();
   // this.rangoIntermedio();

    }

    listConfiguracionIndicadores(idSprIndicador: any) {
      this.configuracionIndicadoresService.list('?idSprIndicador=' + idSprIndicador)
        .subscribe(resp => {
          this.dataConfiguracionIndicadores = resp;
          console.log('ConfigIndicadores: ', this.dataConfiguracionIndicadores);
            this.reDrawDataTable()

        })
      }

  ngOnInit(): void {
    this.nivelSelect = this.currentAmbiente.idSprNivel
    this.getIpPublic();
    this.initApp();
  }

  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      //console.log("Ip: ", this.ipAddress = res.ip);
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

  onSubmit(){
    this.formSubmitted = true;
    this.formConfiguracionIndicadores.value.idSprIndicador =this.idSprIndicador;
    this.formConfiguracionIndicadores.value.usuario = this.currentAmbiente.idSprUsuario;
    this.formConfiguracionIndicadores.value.ip = this.ipAddress;
   //  this.rangoTotal = this.rangoIntermedio();
   // console.log("rango intermedio", this.rangoTotal);
  //  this.formConfiguracionIndicadores.value.rangoIntermedio = this.rangoTotal;
    console.log('grabar/EDITAR: ', this.formConfiguracionIndicadores.value);
console.log('guardoooo',this.formConfiguracionIndicadores.invalid);
    if (this.formConfiguracionIndicadores.invalid) {
      if (this.formConfiguracionIndicadores.value.idSprConfigIndicadores == null) {
this.configuracionIndicadoresService.create(this.formConfiguracionIndicadores.value).subscribe(
  (resp) => {
    this.initApp();
    this.closeModalIndicador();
    this.alert.createOk();
  },
  (err) => {
    this.alert.createError();
  }
);
} else {
this.configuracionIndicadoresService.update(this.formConfiguracionIndicadores.value).subscribe(
  (resp) => {
    this.initApp();
    this.closeModalIndicador();
    this.alert.updateOk();
  },
  (err) => {
    this.alert.updateError();
  }
);
}
return true;
} else {
return false;
}
}

  edit(obj: ConfiguracionIndicadores) {
    this.openModal();
    console.log('Editando: ', obj);
    this.formConfiguracionIndicadores.patchValue({
      idSprConfigIndicador: obj.idSprConfigIndicador,
      idSprIndicador: obj.idSprIndicador,
      idSprUnidadMedida: obj.idSprUnidadMedida,
      idSprUmbral: obj.idSprUmbral,
      idSprComportamiento: obj.idSprComportamiento,
      idSprExpresion: obj.idSprExpresion,
      idSprFrecuencia:obj.idSprFrecuencia,
      idSprJerarquia:obj.idSprJerarquia,
      idSprTipoIndicador:obj.idSprTipoIndicador,
      fechaInicio: obj.fechaInicio,
      lineaBase: obj.lineaBase,
      informacionFormula: obj.informacionFormula,
      metaPeriodo: obj.metaPeriodo,
      numerador: obj.numerador,
      denominador: obj.denominador,
      respaldoPdf: obj.respaldoPdf,
      comentario: obj.comentario,
      mayorIgual: obj.mayorIgual,
      rangoIntermedio: obj.rangoIntermedio,
      menorIgual: obj.menorIgual,
      estado: obj.estado,
    });
  }

  delete(idRegister:number){
    this.modal.open('delete');
   this.idDeleteRegister= idRegister;
  }

  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.configuracionIndicadoresService.delete(
        {"idSprConfigIndicador":this.idDeleteRegister,
        "usuario":this.currentAmbiente.idSprUsuario,
        "delLog":"S",
        "ip":this.ipAddress
      }
      )
        .subscribe(resp => {
          this.initApp();
          this.modal.closeId('delete')
         this.alert.deleteOk();
        }, (err) => {
          this.alert.deleteError();
        });
      }
  }


  //################################################
  //TRAE DATOS DEL CATALOGO COMUN COMPORTAMIENTO//
  //###############################################
  listComportamiento() {
    this.comunService.list()
      .subscribe(resp => {
        this.dataComportamiento = this.getDataDependiente(resp, this.idRecursivoComportamiento);
      })
  }

//################################################
  //TRAE DATOS DEL INDICADORES//
  //###############################################
  listIndicadores() {
    this.indicadoresService.list()
      .subscribe(resp => {
        this.dataIndicadores = resp;
        })
  }

  //TRAE DATOS DE UMBRALES//
  //###############################################
  listUmbrales() {
    this.umbralesService.list()
      .subscribe(resp => {
        this.dataUmbrales = resp;

        })
  }

  //################################################
  //TRAE DATOS DEL CATALOGO COMUN FRECUENCIA//
  //###############################################
  listFrecuencia() {
    this.comunService.list()
      .subscribe(resp => {
        this.dataFrecuencia = this.getDataDependiente(resp, this.idRecursivoFrecuencia);

      })
  }

  //##################################################
  //TRAE DATOS DEL CATALOGO COMUN EXPRESION//
  //#################################################
  listExpresion() {
    this.comunService.list()
      .subscribe(resp => {
        this.dataExpresion = this.getDataDependiente(resp, this.idRecursivoExpresion);
        })
  }

    //#################################################
  //TRAE DATOS DEL CATALOGO ESPECIALUNO JERARUIA//
  //################################################
  listJerarquia() {
    this.especialUnoService.list()
      .subscribe(resp => {
        this.dataJerarquia = this.getDataDependienteEspecialUno(resp, this.idRecursivoJerarquia);
      })
  }

  //TRAE DATOS DEL CATALOGO ESPECIALUNO TIPO INDICADOR//
  //################################################
  listTipoIndicador() {
    this.especialUnoService.list()
      .subscribe(resp => {
        this.dataTipoIndicador = this.getDataDependienteEspecialUno(resp, this.idRecursivoTipoIndicador);
      })
  }

  //#################################################
  //TRAE DATOS DEL CATALOGO ESPECIALDOS UNIDAD DE MEDIDA//
  //################################################
  listUnidadMedida() {
    this.especialDosService.list()
      .subscribe(resp => {
        this.dataUnidadMedida = this.getDataDependienteEspecialDos(resp, this.idRecursivoUnidadMedida);
      })
  }
  //#################################
  //DEPENDIENTE DEL CATALOGO COMUN//
  //###############################
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



 //#################################
  //DEPENDIENTE DEL CATALOGO ESPECIALUNO//
  //###############################
  getDataDependienteEspecialUno(dataObj: any, spr_idSprEspecialUno: any = null) {
    let stateOptionTipo = false;
    let dependientes: any = [];
    dataObj.forEach((row: any) => {
      if (row.spr_idSprEspecialUno == spr_idSprEspecialUno) {
        dependientes.push(
          {
            idSprEspecialUno: row.idSprEspecialUno,
            nombre: row.nombre,
            descripcion: row.descripcion,
            ponderacion: row.ponderacion,
            spr_idSprEspecialUno: row.spr_idSprEspecialUno,
            estado: row.estado,
          });
      }

    });
    return dependientes;
  }


  //#################################
  //DEPENDIENTE DEL CATALOGO ESPECIALDOS//
  //###############################
  getDataDependienteEspecialDos(dataObj: any, spr_idSprEspecialDos: any = null) {
    let stateOptionTipo = false;
    let dependientes: any = [];
    dataObj.forEach((row: any) => {
      if (row.spr_idSprEspecialDos == spr_idSprEspecialDos) {
        dependientes.push(
          {
            idSprEspecialDos: row.idSprEspecialDos,
            nombre: row.nombre,
            descripcion: row.descripcion,
            formula: row.formula,
            spr_idSprEspecialDos: row.spr_idSprEspecialDos,
            estado: row.estado,
          });
      }

    });
    return dependientes;
  }

  rangoIntermedio() {
    let mayorIgual: any;
    let menorIgual: any;
    let totalRango: any;
    mayorIgual = this.formConfiguracionIndicadores.value.mayorIgual;
    console.log('mayor',mayorIgual);
   // if((mayorIgual >= 100) && (menorIgual <= 85)){
    menorIgual = this.formConfiguracionIndicadores.value.menorIgual;
    totalRango = ("entre " + mayorIgual + "%  a ") + (menorIgual+ "%");
      return totalRango;
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
    this.formConfiguracionIndicadores.reset();
}
closeModalIndicador(){

  this.modal.closeId('modalNewEdit');
  }
}
