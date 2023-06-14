import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ProcesoService } from './../../../services/proceso.service';
import { ModalService } from './../../../../../services/modal.service';
import { AlertService } from './../../../../../services/alert.service';
import { IndicadoresService } from './../../../services/indicadores.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ObjetivoService } from '../../../services/objetivo.service';
import { RiesgosService } from '../../../services/riesgos.service';
import { CatComunService } from 'src/app/modulos/catalogos-admin/services/cat-comun.service';
import { ComunService } from 'src/app/modulos/catalogos-proces/services/comun.service';
import { Riesgos } from '../../../models/riesgos';
import { EquipoGerencialService } from 'src/app/modulos/catalogos-proces/services/equipo.gerencial.service';
import { ParticipanteElementoService } from '../../../services/participante.elemento.service';
import { DatePipe } from '@angular/common';
import { AccionService } from '../../../services/accion.service';

@Component({
  selector: 'app-riesgo-objetivo',
  templateUrl: './riesgo-objetivo.component.html',
  styleUrls: ['./riesgo-objetivo.component.css']
})
export class RiesgoObjetivoComponent implements OnInit, OnDestroy {
  public formRiesgo: UntypedFormGroup;
  public submitted = false;
  public dataProcesosIndicadores: any = [];
  public dataObjetivo: any = [];
  private idDeleteRegister: number = 0;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public nameModalRiesgoObjetivo: string = 'modalRiesgoObjetivo';
  public nameModalGestionRO: string = 'modalGestionRO'
  public nameApp = 'Riesgos de Objetivos';
  public nameAppGestionRO = 'Acciones de Riesgos';
  public selectItems: any = [];
  private idSprAmbiente: number = 0;
  public dataRiesgo: any[] = [];
  public dataObjetivoRiesgo: any = [];
  public dataCatComun!: any;
  public calificacionTotal!: any;
  public idRecursivoEdr: number = 290;
  public riesgos!: any;
  public idRiesgoSeleccionado: number = 0;
  public idRiesgo!: any;
  public riesgosOutput!: any;
  public dataEquipoGerencial!: any;
  public dataTipoParticpacion: any = [];
  public dataPersonalElemento!: any;
  public dataResponsableProceso: any = [];
  pipe = new DatePipe('en-US');
  hoy = new Date();
  public currentAmbiente!: any;
  public dataAccion: any[] = [];



  @Input() set init(objetivo: any) {
    this.initApp(objetivo);
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();



  constructor(
    public modal: ModalService,
    private ip: IpPublicService,
    private alert: AlertService,
    private fb: FormBuilder,
    private objetivoService: ObjetivoService,
    private riesgoService: RiesgosService,
    private catalogoComunService: ComunService,
    private equipoGerencialService: EquipoGerencialService,
    private participanteElementoService: ParticipanteElementoService,
    private accionService: AccionService,
  ) {

    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.currentAmbiente = JSON.parse(this.buffer);
    //this.nombreUnidad = this.currentAmbiente.nombreUnidad;
    this.selectItems = [
      { value: '', label: 'Selecione..' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
    this.idSprAmbiente = this.currentUser.idSprAmbiente;
    console.log('CONSTRUCTOR PROCESOS: ');

  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  initApp(data: any) {
    if (data == 'objetivo') {
      this.listObjetivos();
    }
    this.getIpPublic();
    this.getDataCatalogoComun();
    this.listEquipoGerencial();
  }

  listObjetivos() {
    this.objetivoService.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
      this.dataObjetivo = resp;
      console.log('Procesos: ', this.dataObjetivo);
      this.listObjetivosRiesgos();
    });
  }

  listObjetivosRiesgos() {
    this.riesgoService.list().subscribe((resp) => {
      this.dataRiesgo = resp;
      this.getParticipanteElemento();
    });
  }

  getParticipanteElemento() {
    this.participanteElementoService.list().subscribe(dataPersonalElemento => {
      this.dataPersonalElemento = dataPersonalElemento;
      this.getEquipoGerencial();
    })
  }
  getEquipoGerencial() {
    console.log('idEquipo gerencial: ', this.idSprAmbiente);
    this.equipoGerencialService.list('?idSprAmbiente=' + this.idSprAmbiente).subscribe(dataEquipoGerencial => {
      this.dataEquipoGerencial = dataEquipoGerencial;
      this.mapeoObjetivoRiesgo();
    })
  }

  mapeoObjetivoRiesgo() {
    let indiceUno = 0;
    let dataObjetivoRiesgoMap: any = [];
    let dataRiesgosMap: any = [];
    for (let i = 0; i < this.dataObjetivo.length; i++) {
      for (let j = 0; j < this.dataRiesgo.length; j++) {
        if (this.dataObjetivo[i].idSprObjetivo == this.dataRiesgo[j].idSprObjetivo) {
          for (let k = 0; k < this.dataPersonalElemento.length; k++) {
            if (this.dataPersonalElemento[k].idSprRiesgo == this.dataRiesgo[j].idSprRiesgo) {
              for (let l = 0; l < this.dataEquipoGerencial.length; l++) {
                if ((this.dataEquipoGerencial[l].idSprEquipoGerencial == this.dataPersonalElemento[k].idSprEquipoGerencial)&&(this.dataPersonalElemento[k].estado==1)) {
                  dataRiesgosMap.push({
                    idSprObjetivo: this.dataObjetivo[i].idSprObjetivo,
                    idSprRiesgo: this.dataRiesgo[j].idSprRiesgo,
                    nombre: this.dataRiesgo[j].nombre,
                    descripcion: this.dataRiesgo[j].descripcion,
                    probabilidad: this.dataRiesgo[j].probabilidad,
                    impacto: this.dataRiesgo[j].impacto,
                    calificacion: this.dataRiesgo[j].calificacion,
                    costoPotencial: this.dataRiesgo[j].costoPotencial,
                    idSprEstructuraEdr: this.dataRiesgo[j].idSprEstructuraEdr,
                    fechaIdentificacion: this.dataRiesgo[j].fechaIdentificacion,
                    fechaOcurrencia: this.dataRiesgo[j].fechaOcurrencia,
                    fechaCierre: this.dataRiesgo[j].fechaCierre,
                    estado: this.dataRiesgo[j].estado,
                    fecha: this.dataRiesgo[j].fecha,
                    idSprEquipoGerencial:this.dataEquipoGerencial[l].idSprEquipoGerencial,
                    gradoNombres: this.dataEquipoGerencial[l].gradoNombres,
                    idSprParticipanteElemento: this.dataPersonalElemento[k].idSprParticipanteElemento
                  }); indiceUno++;
                }
              }
            }
          }        
        }
      }
      dataObjetivoRiesgoMap.push({
        objetivo: this.dataObjetivo[i].nombre,
        idSprObjetivo: this.dataObjetivo[i].idSprObjetivo,
        riesgos: dataRiesgosMap
      }); dataRiesgosMap = [];
    }    
    this.dataObjetivoRiesgo = dataObjetivoRiesgoMap
    console.log("dataObjetivoRiesgo", this.dataObjetivoRiesgo)
  }

  get appForm() {
    return this.formRiesgo.controls;
  }

  ngOnInit(): void {
    //this.getIpPublic();
    this.setFromObjetivo();
    // this.getDataCatalogoComun()
    console.log('INIT::::: ');
  }

  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
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


  setFromObjetivo(idSprObjetivo: string = " ") {
    console.log('Modal row...', idSprObjetivo)
    this.formRiesgo = this.fb.group({
      idSprObjetivo: [idSprObjetivo],
      idSprRiesgo: [],
      idSprEstructuraEdr: ['', [Validators.required]],
      idSprEquipoGerencialAnterior: ['', []],
      idSprParticipanteElemento: ['', []],
      idSprEquipoGerencial: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: [],
      fechaIdentificacion: ['', [Validators.required]],
      probabilidad: ['', [Validators.required]],
      impacto: ['', [Validators.required]],
      calificacion: [],
      costoPotencial: ['', [Validators.required]],
      fechaOcurrencia: ['', [Validators.required]],
      fechaCierre: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
  }

  validacionFechas(fecha1: Date, fecha2:Date, fecha3:Date ){
    let alerta1
    let alerta2
    if (fecha1 > fecha2) {
      alerta1 = this.alert.warning(
        'ERROR',
        'La fecha IDENTIFICACIÓN no puede ser mayor a la fecha OCURRENCIA'
      );
      return alerta1
    }
    if (fecha2 > fecha3) {
      alerta2 = this.alert.warning(
        'ERROR',
        'La fecha OCURRENCIA no puede ser mayor a la fecha CIERRE'
      );
      return alerta2
    }    
  }

  onSubmit() {
    let stateInsert: boolean = false;
    let idSprRiesgoInsertado: number = 0;
    this.submitted = true;
    this.formRiesgo.value.usuario = this.currentUser.idSprUsuario;
    this.formRiesgo.value.ip = this.ipAddress;
    this.formRiesgo.value.nombre = this.formRiesgo.value.nombre.toUpperCase();
    this.calificacionTotal = this.calificacion();
    this.formRiesgo.value.calificacion = this.calificacionTotal;
    let fechaIdentificacion = this.formRiesgo.value.fechaIdentificacion;
    let fechaOcurrencia = this.formRiesgo.value.fechaOcurrencia;
    let fechaCierre = this.formRiesgo.value.fechaCierre;
    this.validacionFechas(fechaIdentificacion, fechaOcurrencia, fechaCierre ); 

    if ((!this.formRiesgo.invalid)&&(fechaIdentificacion<fechaOcurrencia)&&(fechaOcurrencia<fechaCierre)) {
      console.log('Data save: ', this.formRiesgo.value);
      if (this.formRiesgo.value.idSprRiesgo == null) {
        this.riesgoService.create(this.formRiesgo.value).subscribe(
          (resp) => {
            stateInsert = true;
            idSprRiesgoInsertado = resp.idSprRiesgo;

            let dataParticpante = {
              idSprEquipoGerencial: this.formRiesgo.value.idSprEquipoGerencial,
              fechaInicio: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
              usuario: this.currentAmbiente.idSprUsuario,
              idSprRiesgo: idSprRiesgoInsertado,
              estado: 1,
              ip: this.ipAddress,
            }
            console.log('Data idSprRiesgoInsertado save: ', dataParticpante);

            if (stateInsert) {
              this.participanteElementoService.create(dataParticpante).subscribe(responseParticipaELement => {
                console.log('Participante-elemento: ', responseParticipaELement);
                stateInsert = true;
              },
                (error) => {
                  console.log('Error al insertar participante: ', error);
                  stateInsert = false;
                });
            }
            //this.initApp();
            this.listObjetivos();
            this.modal.close();
            this.alert.createOk();

          },
          (err) => {
            this.alert.createError();
          }
        );
      } else {
        this.riesgoService.update(this.formRiesgo.value).subscribe(
          (resp) => {
            if (this.formRiesgo.value.idSprEquipoGerencial != this.formRiesgo.value.idSprEquipoGerencialAnterior) {
              let estadoParticipante: boolean = true;
              if (this.formRiesgo.value.idSprEquipoGerencialAnterior != null) {
                let dataParticipanteELemento = {
                  idSprParticipanteElemento: this.formRiesgo.value.idSprParticipanteElemento,
                  fechaFin: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
                  usuario: this.currentAmbiente.idSprUsuario,
                  estado: 2,
                  ip: this.ipAddress,
                }                
                this.participanteElementoService.update(dataParticipanteELemento).subscribe(responseParticipaELement => {
                },
                  (error) => {
                    estadoParticipante = false;
                    stateInsert = false;
                  });
              }
              if (estadoParticipante) {
                
               /* for (let i = 0; i < this.dataPersonalElemento.length; i++){
                if (this.formRiesgo.value.idSprEquipoGerencialAnterior == this.dataPersonalElemento[i].idSprEquipoGerencial) {
                  console.log('Insertar participante nuevo: ', this.dataPersonalElemento[i].idSprEquipoGerencial);
                  let dataParticipanteELemento = {
                    idSprParticipanteElemento: this.formRiesgo.value.idSprParticipanteElemento,
                    fechaFin: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
                    usuario: this.currentAmbiente.idSprUsuario,
                    estado: 1,
                    ip: this.ipAddress,
                  }                
                  this.participanteElementoService.update(dataParticipanteELemento).subscribe(responseParticipaELement => {
                  },
                    (error) => {
                      //estadoParticipante = false;
                      //stateInsert = false;
                    });
                }
              }*/
                let dataParticipElemento = {
                  idSprEquipoGerencial: this.formRiesgo.value.idSprEquipoGerencial,
                  fechaInicio: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
                  usuario: this.currentAmbiente.idSprUsuario,
                  idSprRiesgo: this.formRiesgo.value.idSprRiesgo,
                  estado: 1,
                  ip: this.ipAddress
                }
                console.log('Insertar participante nuevo: ', dataParticipElemento);
                this.participanteElementoService.create(dataParticipElemento).subscribe(responseParticipaELement => {
                  //console.log('Participante creado: ', responseParticipaELement);
                },
                  (error) => {
                    stateInsert = false;
                    //console.log('Error al insertar nuevo participante: ', error);
                  });
              }// Fin insertar participante
            }       
            this.listObjetivos();
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



  delete(id: number) {
    this.idDeleteRegister = id;
    this.modal.open('del');
  }

  confirmDelete() {

    if (this.idDeleteRegister > 0) {
      this.accionService.list(`?idSprRiesgo=${this.idDeleteRegister}&delLog=N`)
        .subscribe(response => {
          if (response.length < 1) {
    
    let errorDeleteState: boolean = false;
    let dataDeleteParticipElementos = { 
      usuario: this.currentAmbiente.idSprUsuario, 
      idSprParticipanteElemento: 0, 
      ip: this.ipAddress, 
      delLog: 'S' }
    let dataDeleteProceso = { 
      idSprRiesgo: this.idDeleteRegister, 
      usuario: this.currentAmbiente.idSprUsuario, 
      ip: this.ipAddress, 
      delLog: 'S' }
    if (this.idDeleteRegister > 0) {
      let participantesElementos = [];
      this.participanteElementoService.list(`?idSprRiesgo=${this.idDeleteRegister}`).subscribe(response => {
        participantesElementos = response;       
          
          
          // Foreach 2              
          participantesElementos.forEach(itemParticipanteElement => {
            dataDeleteParticipElementos.idSprParticipanteElemento = itemParticipanteElement.idSprParticipanteElemento;
            this.participanteElementoService.delete(dataDeleteParticipElementos).subscribe({
              next: responseDelete => {
                console.log('Eliminado 2 Ok: ', responseDelete);
              
                this.riesgoService.delete(dataDeleteProceso).subscribe({
                  next: responseDelete => {

                    console.log('Eliminado proceso Ok: ', responseDelete);
                  },
                  error: (error) => {
                    errorDeleteState = true;
                    console.log('Ocurrio un error al eliminar 1: ', error);
                  }
                })

              },
              error: (error) => {
                errorDeleteState = true;
                dataDeleteProceso.delLog = 'N';
                this.riesgoService.delete(dataDeleteProceso).subscribe({
                  next: responseDelete => {
                    console.log('Reversado proceso ok: ', responseDelete);
                  },
                  error: (error) => {
                    errorDeleteState = true;
                    console.log('Ocurrio un error al reversar proceso: ', error);
                  }
                })
                console.log('Ocurrio un error al eliminar particp-elem: ', error);
              }
            })
          });// Fin forEach 2
        
      });     
    }
    if (!errorDeleteState) {
      console.log('Ocurrio un error al eliminar particp-elem: ');
      this.listObjetivos();
      this.setDataTable();
      //this.setForm();
      this.alert.deleteOk();
      this.modal.close();
    } else {
      this.alert.deleteError();
    }
  } else {
    this.alert.warning("Atención", "No se puede borrar este registro, existe ACCIONES relacionadas!")
    this.modal.close();
  }
});
} else {
this.alert.warning("Atención", "Ocurrió un error al intentar borrar el registro");
this.modal.close();
}
  }

  edit(obj: Riesgos) {
    //this.openModal(id);
    console.log('Editar: ', obj);
    //this.setFromObjetivo(id)
    this.formRiesgo.patchValue({
      idSprObjetivo: obj.idSprObjetivo,
      idSprRiesgo: obj.idSprRiesgo,
      idSprEstructuraEdr: obj.idSprEstructuraEdr,
      idSprEquipoGerencial:obj.idSprEquipoGerencial,
      idSprEquipoGerencialAnterior: obj.idSprEquipoGerencial,
      idSprParticipanteElemento: obj.idSprParticipanteElemento,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      fechaIdentificacion: obj.fechaIdentificacion,
      probabilidad: obj.probabilidad,
      impacto: obj.impacto,
      calificacion: obj.calificacion,
      costoPotencial: obj.costoPotencial,
      fechaOcurrencia: obj.fechaOcurrencia,
      fechaCierre: obj.fechaCierre,
      estado: obj.estado,
    });
    //this.idLineaAccion = obj.idSprLineaAccion;
    this.modal.open(this.nameModalRiesgoObjetivo);
  }

  getDataCatalogoComun() {
    this.catalogoComunService.list()
      .subscribe(resp => {
        this.dataCatComun = this.getDataDependiente(resp, this.idRecursivoEdr);
      })
  }

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

  calificacion() {
    let probabilidad: any;
    let impacto: any;
    let totalCalificacion: any;

    probabilidad = this.formRiesgo.value.probabilidad;
    impacto = this.formRiesgo.value.impacto;
    totalCalificacion = (probabilidad * impacto) / 100;
    return totalCalificacion;
  }
  /********************************** EQUIPO GERENCIAL************************************/
  listEquipoGerencial() {
    console.log('idEquipo gerencial: ', this.idSprAmbiente);
    this.equipoGerencialService.list('?idSprAmbiente=' + this.idSprAmbiente).subscribe(dataEquipoGerencial => {
      this.dataEquipoGerencial = dataEquipoGerencial;
      console.log('idEquipo gerencial: ',  this.dataEquipoGerencial);
      this.getTipoParticipacion();
      
    })
  }

  getTipoParticipacion() {
    this.catalogoComunService.list("?spr_idSprComun=271").subscribe(respTipoParticipa => {
      this.dataTipoParticpacion = respTipoParticipa;
      //console.log('TIpo participa: ',this.dataTipoParticpacion );
      this.mapeoEquipoGerencialTipoParticipa();
    })
  }

  mapeoEquipoGerencialTipoParticipa() {
    let dataProcess = [];
    for (let i = 0; i < this.dataEquipoGerencial.length; i++) {
      for (let j = 0; j < this.dataTipoParticpacion.length; j++) {
        if ((this.dataEquipoGerencial[i].idSprTipoParticipante === this.dataTipoParticpacion[j].idSprComun) && (this.dataEquipoGerencial[i].estado == 1) && (this.dataEquipoGerencial[i].idSprTipoParticipante != 293)) {
          dataProcess.push({
            idSprEquipoGerencial: this.dataEquipoGerencial[i].idSprEquipoGerencial,
            nombres: this.dataEquipoGerencial[i].gradoNombres,
            cedula: this.dataEquipoGerencial[i].cedula,
            participacion: this.dataTipoParticpacion[j].nombre
          })
        }
      }
    }
    this.dataResponsableProceso = dataProcess;

  }

  /*mostrarAcciones(row: any) {
    console.log('Row: ', row);
    this.idRiesgoSeleccionado = row.idSprRiesgo
    this.openModalGestion();
    //this.getAcciones();
  }
  getAcciones() {
    this.riesgosOutput = {
      name: 'acciones',
      idSprRiesgo: this.idRiesgoSeleccionado
    }
  }*/


  openModal(row: any) {
    this.setFromObjetivo(row.idSprObjetivo);
    this.modal.open(this.nameModalRiesgoObjetivo);
  }
  openModalGestion(row: any) {
    this.onResetForm();
    console.log('Row: ', row);
    this.idRiesgoSeleccionado = row.idSprRiesgo
    this.modal.open(this.nameModalGestionRO);
  }

  onResetForm() {
    this.submitted = false;
    this.formRiesgo.reset();
  }

}
