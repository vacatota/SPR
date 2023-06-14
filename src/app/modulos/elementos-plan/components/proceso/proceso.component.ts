import { EspecialUnoService } from 'src/app/modulos/catalogos-proces/services/especial-uno.service';
import { Proceso } from './../../models/proceso';
import { ProcesoService } from '../../services/proceso.service';
import { AreaElementoService } from '../../services/area.elemento.service';
import { AreaService } from './../../../catalogos-admin/services/area.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, FormArray, FormControl } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { DataTableDirective } from 'angular-datatables';
import { ObjetivoService } from '../../services/objetivo.service';
import { EstrategiasService } from '../../services/estrategias.service';
import { ComunService } from 'src/app/modulos/catalogos-proces/services/comun.service';
import { EquipoGerencialService } from 'src/app/modulos/catalogos-proces/services/equipo.gerencial.service';
import { EstrategiaObjetivoService } from '../../services/estrategia-objetivo.service';
import { ParticipanteElementoService } from '../../services/participante.elemento.service';
import { Subject, forkJoin, mergeMap } from 'rxjs';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css']
})
export class ProcesoComponent implements OnInit, OnDestroy {
  breadCrumbItems = [{ label: 'Formulación' }, { label: 'Planes' }, { label: 'Procesos', active: true }];
  public formProceso!: UntypedFormGroup;
  public formSubmitted = false;
  public currentAmbiente!: any;
  public ipAddress!: string;
  public buffer: any;
  public nameModal: string = 'modalPlanAccion';
  public modalEle: string = 'modalEle';
  public dataProcesos: any[] = [];
  public modalPlanAccion: any;
  public modalElementos: boolean = false;
  public dataObjetivo!: any;// trae data de objetivos
  public dataAreas!: any;// trae data de areas del Ambiente
  public dataAreasChecked: any = []; //data para Area
  public dataAreasProcess: any = [];
  public dataTipoParticpacion: any = [];
  public dataResponsableProceso: any = [];
  public dataElementosParticpantes: any = [];
  public dataEquipoGerencial!: any;
  public dataEstrategias!: any;
  public dataCatComun!: any;// trae data catalogo especialUno
  public dataCatEspecialUno!: any;// trae data catalogo comun
  public dataTipoProceso!: any;// trae data catalogo especial uno tipo de proceso
  public dataEstrategiasObjetivos: any = [];// trae data catalogo comun tipo de proceso
  public dataEstrategiasProcess: any = [];// trae data catalogo comun tipo de proceso
  public dataMejoras!: any;// trae data catalogo comun Mejoras
  public dataEstrategiasMain!: any;// trae data de estrategias
  public nombreUnidad!: any;
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameModal1: string = 'modalNewEdit1'
  nameApp = 'Procesos';
  desripcionProceso!: any;
  nombreEstrategia!: any;
  nombreObjetivo!: any;
  nombreTipoProceso!: any;
  nombreTipoCliente!: any;
  public idSprNivel: number = 0;
  nombreMejoras!: any;
  idSprAmbiente!: number;
  public idSprNivel5: number = 287;
  public nivelSelect!: number;
  idRecursivoCliente: number = 220;
  idRecursivoProceso: number = 119;
  idRecursivoMejoras: number = 223;
  tipoParticipacion: number = 293;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  inputs = [{ value: '' }];
  modalOpen = false;
  edit: boolean = false;
  areaElementoGuardado = [];
  public idProceso!: any;
  public desempenio = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;



  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService,
    private objetivoService: ObjetivoService,
    private comunService: ComunService,
    private especialUnoService: EspecialUnoService,
    private areaServcie: AreaService,
    private equipoGerencialService: EquipoGerencialService,
    private areaELemService: AreaElementoService,
    private estrategiaService: EstrategiasService,
    private estrategiaObjetivosService: EstrategiaObjetivoService,
    private participanteElementoService: ParticipanteElementoService,
  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.currentAmbiente = JSON.parse(this.buffer);
    this.nombreUnidad = this.currentAmbiente.nombreUnidad;
    this.selectItems = [
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
    this.idSprAmbiente = this.currentAmbiente.idSprAmbiente;
    this.idSprNivel = this.currentAmbiente.idSprNivel;
    console.log('Fecha: ', this.pipe.transform(this.hoy, 'YYYY-MM-dd'));
  }


  get procesoForm() {
    return this.formProceso.controls;
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
    this.formProceso = this.fb.group({
      idSprProceso: [],
      idSprAreaProceso: [],
      idSprArea: new FormArray([]),
      //idSprEquipoGerencial: new FormArray([]),
      idSprObjetivo: [],
      idSprEstrategia: [],
      idSprTipoProceso: [],
      idSprAmbiente: [],
      idSprMejoras: [],
      idSprTipoCliente: ['', [Validators.required]],
      idSprEquipoGerencialAnterior: ['', []],
      idSprParticipanteElemento: ['', []],
      idSprEquipoGerencial: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: [],
      producto: [],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      tiempoCiclo: [5],
      numeroPersonaAsignada: [4],
      procesoDocumentado: [3],
      procesoCertificado: [2],
      fechaCertificacion: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
  }

  initApp() {
    this.listObjetivo();
    this.setDataTable();
    this.setForm();
    this.listTipoCliente();
    this.listTipoProceso();
    this.listMejoras();
    this.listAreas();
    this.listEquipoGerencial();
    this.listDataProcesos()
  }

  ngOnInit(): void {
    this.nivelSelect = this.currentAmbiente.idSprNivel
    this.getIpPublic();
    this.initApp();
    console.log('Niveles', this.idSprNivel, " ", this.idSprNivel5);
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

  setDataAreasChecked() {
    console.log('Set: ');
    let areasFixed = this.dataAreas;
    let checked: boolean = false;
    for (let i = 0; i < this.dataAreas.length; i++) {
      for (let j = 0; j < this.dataAreasChecked.length; j++) {
        if (this.dataAreas[i].idSprArea == this.dataAreasChecked[j].idSprArea) {
          checked = true;
        }
      }
      areasFixed[i].checked = checked;
      checked = false;
    }
    this.dataAreasProcess = areasFixed;
    console.log('Arreglo html checked: ', this.dataAreasProcess);
  }




  onSubmit() {
    let stateInsert: boolean = false;
    let idSprProcesoInsertado: number = 0;
    let idSprProceso = this.formProceso.value.idSprProceso;
    let idSprUsuario = this.currentAmbiente.idSprUsuario;
    this.formProceso.value.usuario = this.currentAmbiente.idSprUsuario;
    this.formProceso.value.ip = this.ipAddress;
    this.formProceso.value.idSprAmbiente = this.currentAmbiente.idSprAmbiente;
    this.formProceso.value.nombre = this.formProceso.value.nombre.toUpperCase();
    this.formSubmitted = true;
    console.log('data Guardar: ', this.formProceso.value);
    //return true;
    if (this.formProceso.valid) {
      //Realizar el posteo
      if (this.idSprNivel != this.idSprNivel5) {
        this.formProceso.value.idSprObjetivo = null;
      }
      if (this.formProceso.value.idSprProceso == null || this.formProceso.value.idSprProceso == " ") {

        let idsAreas = this.formProceso.value.idSprArea
        this.procesoService.create(this.formProceso.value).subscribe(
          dataProcesoResponse => {
            console.log('Proceso: ', dataProcesoResponse);
            stateInsert = true;
            idSprProcesoInsertado = dataProcesoResponse.idSprProceso;
            for (let idsArea of idsAreas) {
              let dataAreas = {
                idSprProceso: dataProcesoResponse.idSprProceso,
                idSprArea: idsArea,
                usuario: this.currentAmbiente.idSprUsuario,
                ip: this.ipAddress,
                estado: 1
              }
              //Insertando areas-elemento
              this.areaELemService.create(dataAreas).subscribe(dataAreaELemento => {
                stateInsert = true;
                console.log('Area-elementos: ', dataAreaELemento);
              }, (error) => {
                console.log('Ocurrio un error area-elementos: ', error);
                stateInsert = false;
              }
              );
            }// Fin for

            if (stateInsert) {
              this.participanteElementoService.create({
                idSprEquipoGerencial: this.formProceso.value.idSprEquipoGerencial,
                fechaInicio: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
                usuario: this.currentAmbiente.idSprUsuario,
                idSprProceso: idSprProcesoInsertado,
                estado: 1,
                ip: this.ipAddress,
              }).subscribe(responseParticipaELement => {
                console.log('Participante-elemento: ', responseParticipaELement);
                stateInsert = true;
              },
                (error) => {
                  console.log('Error al insertar participante: ', error);
                  stateInsert = false;
                });
            }
            if (stateInsert) {
              this.initApp();
              this.modal.close();
              this.alert.createOk();
            } else {
              this.alert.createError();
            }
            return true;
          },
          (err) => {
            stateInsert = false;
          });
      } else {
        let idsAreasDeFormulario = this.formProceso.value.idSprArea;
        this.formProceso.value.ip = this.ipAddress;
        this.formProceso.value.idSprAmbiente = this.currentAmbiente.idSprAmbiente;
        this.formProceso.value.usuario = this.currentAmbiente.idSprUsuario;
        let dataFormulario = this.formProceso.value;

        //console.log('Editando...............1: ', dataFormulario);
        stateInsert = true;
        // Caso contrario: para actualizar items de procesos
        let idsAreasProcesosActuales;
        this.areaELemService.list(`?idSprProceso=${this.formProceso.value.idSprProceso}`).subscribe(dataAreaElementosActuales => {
          idsAreasProcesosActuales = dataAreaElementosActuales;
          //console.log('Editando................: ', dataFormulario );
          // Actualizacion a la tabla procesos
          this.procesoService.update(dataFormulario).subscribe(data => {
            let insertarNuevo: boolean = true;

            // Verificamos si existe areas nuevas q agregar
            //console.log('seelccioandas -> exsitentes: ', idsAreasDeFormulario.length + " ==> "+ idsAreasProcesosActuales.length );
            if (idsAreasDeFormulario.length >= idsAreasProcesosActuales.length) {
              //console.log('Agregar areas nuevas: ' );
              for (let i = 0; i < idsAreasDeFormulario.length; i++) {
                for (let j = 0; j < idsAreasProcesosActuales.length; j++) {
                  if (idsAreasProcesosActuales[j].idSprArea == idsAreasDeFormulario[i] && idsAreasProcesosActuales[j].estado == 1) {
                    // Si existe el sprAreaProceso
                    insertarNuevo = false;
                  }
                }
                if (insertarNuevo) {
                  let dataAreaProcesoCreate = {
                    idSprProceso: idSprProceso,
                    idSprArea: idsAreasDeFormulario[i],
                    usuario: idSprUsuario, ip: this.ipAddress, estado: 1
                  }
                  //console.log('Create area-elemento: ', dataAreaProcesoCreate);
                  this.areaELemService.create(dataAreaProcesoCreate).subscribe(response => {
                    insertarNuevo = false;
                    //console.log('Area-obj nuevo: ', response);
                  }, (err) => {
                    stateInsert = false;
                  });
                } else {
                  insertarNuevo = true;
                }
              }// Fin for
            } else {
              //console.log('Eliminar items areas: ' );
              // Opcion Else para quitar items areaElementos
              let deleteConfirm: boolean = false;
              for (let j = 0; j < idsAreasProcesosActuales.length; j++) {
                for (let i = 0; i < idsAreasDeFormulario.length; i++) {

                  if (idsAreasProcesosActuales[j].idSprArea == idsAreasDeFormulario[i]) {
                    deleteConfirm = true;
                  }
                }
                if (!deleteConfirm) {
                  let dataAreaProcesoCreate = {
                    idSprAreaElemento: idsAreasProcesosActuales[j].idSprAreaElemento,
                    delLog: 'S', usuario: idSprUsuario, ip: this.ipAddress, estado: 1
                  }
                  this.areaELemService.update(dataAreaProcesoCreate).subscribe(response => {
                    deleteConfirm = false;
                    //console.log('Area-proceso eliminado: ', response);
                  }, (error) => {
                    stateInsert = false;
                  });
                } else {
                  deleteConfirm = false;
                }
              }// Fin for quitar items
            }// Fin agregar/quitar items areaElementos
          }, (err) => {
            console.log('Error: ', err);
            stateInsert = false;
          });// Fin update proceso
        }, (err) => {
          stateInsert = false;
        });// FIn list areaElementos

        // Gestion responsable-proceso
        if (this.formProceso.value.idSprEquipoGerencial != this.formProceso.value.idSprEquipoGerencialAnterior) {
          let estadoParticipante: boolean = true;

          // Desabilitando responsable anterior
          if (this.formProceso.value.idSprEquipoGerencialAnterior != null) {
            let dataParticipanteELemento = {
              idSprParticipanteElemento: this.formProceso.value.idSprParticipanteElemento,
              fechaFin: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
              usuario: idSprUsuario, ip: this.ipAddress, estado: 2
            }
            //console.log('Participante-anterior desabilitar: ', dataParticipanteELemento);

            this.participanteElementoService.update(dataParticipanteELemento).subscribe(responseResponsable => {
              //console.log('Desabilitado responsable anterior: ', responseResponsable);
            }, (err) => {
              estadoParticipante = false;
              stateInsert = false;
            });//FIn update participante-elemento
          }// Fin si idParticipante anterior no es nulo

          if (estadoParticipante) {
            let dataParticipElemento = {
              idSprEquipoGerencial: this.formProceso.value.idSprEquipoGerencial,
              fechaInicio: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
              usuario: this.currentAmbiente.idSprUsuario,
              idSprProceso: idSprProceso,
              estado: 1,
              ip: this.ipAddress
            }
            //console.log('Insertar participante nuevo: ', dataParticipElemento);
            this.participanteElementoService.create(dataParticipElemento).subscribe(responseParticipaELement => {
              //console.log('Participante creado: ', responseParticipaELement);
            },
              (error) => {
                stateInsert = false;
                //console.log('Error al insertar nuevo participante: ', error);
              });
          }// Fin insertar participante

        } else {
          //console.log('No modificado participante: ');
        }
        if (stateInsert) {
          this.initApp();
          this.modal.close();
          this.alert.updateOk();
        } else {
          this.alert.updateError();
        }
      }// Fin else actualizar
    } else {
      console.log('Formurio invalido');
    }
    return false;
  }




  update(obj: any) {
    console.log('Editando: ', obj);
    this.onResetForm();
    this.openModal();
    this.areaELemService.list("?idSprProceso=" + obj.idSprProceso).subscribe(response => {
      this.dataAreasChecked = response;
      console.log('Areas: ', response);
      this.setDataAreasChecked();
      this.addItemChecked(response);
    })

    //this.addItemChecked(obj.areas);
    console.log('Areas recuperadas para editar: ', this.dataAreasChecked, "Cant: ", this.dataAreasChecked.length);
    this.formProceso.patchValue({
      idSprProceso: obj.idSprProceso,
      idSprObjetivo: obj.idSprObjetivo,
      idSprEstrategia: obj.idSprEstrategia,
      idSprEquipoGerencial: obj.idSprEquipoGerencial,
      idSprEquipoGerencialAnterior: obj.idSprEquipoGerencial,
      idSprParticipanteElemento: obj.idSprParticipanteElemento,
      idSprMejoras: obj.idSprMejoras,
      idSprTipoProceso: obj.idSprTipoProceso,
      idSprTipoCliente: obj.idSprTipoCliente,
      idSprAreaProceso: obj.idSprAreaProceso,
      idSprArea: obj.idSprArea,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      producto: obj.producto,
      fechaInicio: obj.fechaInicio,
      fechaFin: obj.fechaFin,
      tiempoCiclo: obj.tiempoCiclo,
      numeroPersonaAsignada: obj.numeroPersonaAsignada,
      procesoDocumentado: obj.procesoDocumentado,
      procesoCertificado: obj.procesoCertificado,
      fechaCertificacion: obj.fechaCertificacion,
      estado: obj.estado,
    });
  }

  delete(idRegister: number) {
    this.modal.open('delete');
    this.idDeleteRegister = idRegister;
  }

  confirmDelete() {
    let errorDeleteState: boolean = false;
    let dataDeleteAreElementos = { usuario: this.currentAmbiente.idSprUsuario, idSprAreaElemento: 0, ip: this.ipAddress, delLog: 'S' }
    let dataDeleteParticipElementos = { usuario: this.currentAmbiente.idSprUsuario, idSprParticipanteElemento: 0, ip: this.ipAddress, delLog: 'S' }
    let dataDeleteProceso = { idSprProceso: this.idDeleteRegister, usuario: this.currentAmbiente.idSprUsuario, ip: this.ipAddress, delLog: 'S' }
    if (this.idDeleteRegister > 0) {
      let areasELementos = [];
      let participantesElementos = [];
      this.participanteElementoService.list(`?idSprProceso=${this.idDeleteRegister}`).subscribe(response => {
        participantesElementos = response;
        this.areaELemService.list(`?idSprProceso=${this.idDeleteRegister}`).subscribe(response => {
          areasELementos = response;
          // Foreach 1
          areasELementos.forEach(itemAreaElement => {
            dataDeleteAreElementos.idSprAreaElemento = itemAreaElement.idSprAreaElemento;
            this.areaELemService.delete(dataDeleteAreElementos).subscribe({
              next: responseDelete => {

                console.log('Eliminado 1 Ok: ', responseDelete);
              },
              error: (error) => {
                errorDeleteState = true;      errorDeleteState = true;
                dataDeleteProceso.delLog = 'N';
                this.procesoService.delete(dataDeleteProceso).subscribe({
                  next: responseDelete => {
                    console.log('Reversado proceso ok: ', responseDelete);
                  },
                  error: (error) => {
                    errorDeleteState = true;
                    console.log('Ocurrio un error al reversar proceso: ', error);
                  }
                })
                console.log('Ocurrio un error al eliminar 1: ', error);
              }
            })
          });// Fin forEach 1
          // Foreach 2
          participantesElementos.forEach(itemParticipanteElement => {
            dataDeleteParticipElementos.idSprParticipanteElemento = itemParticipanteElement.idSprParticipanteElemento;
            this.participanteElementoService.delete(dataDeleteParticipElementos).subscribe({
              next: responseDelete => {
                console.log('Eliminado 2 Ok: ', responseDelete);

                this.procesoService.delete(dataDeleteProceso).subscribe({
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
                this.procesoService.delete(dataDeleteProceso).subscribe({
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
      });
    }
    if (!errorDeleteState) {
      this.initApp();
      this.alert.deleteOk();
      this.modal.close();
    } else {
      this.alert.deleteError();
    }
  }


  //Detalle Proceso
  desempenioInit(obj: any) {
    this.desripcionProceso = obj.nombre;
    //console.log('Desempenio: ', obj);
    this.desempenio = obj;
    //this.dese
    this.openModalDesempenio();
   /*  this.formProceso.patchValue({
      idSprProceso: obj.idSprProceso,
      idSprObjetivo: obj.objetivo,
      idSprEstrategia: obj.estrategia,
      idSprTipoCliente: obj.tipoCliente,
      idSprTipoProceso: obj.tipoProceso,
      idSprMejoras: obj.mejoras,
      descripcion: obj.descripcion,
      producto: obj.producto,
      fechaInicio: obj.fechaInicio,
      fechaFin: obj.fechaFin,
      tiempoCiclo: obj.tiempoCiclo,
      numeroPersonaAsignada: obj.numeroPersonaAsignada,
      procesoDocumentado: obj.procesoDocumentado,
      procesoCertificado: obj.procesoCertificado,
      fechaCertificacion: obj.fechaCertificacion,
    });

    this.desripcionProceso = obj.nombreProceso;
    this.nombreObjetivo = obj.objetivo;
    this.nombreEstrategia = obj.estrategia;
    this.nombreTipoProceso = obj.tipoProceso;
    this.nombreTipoCliente = obj.tipoCliente;
    this.nombreMejoras = obj.mejoras;
    this.idProceso = obj.idSprProceso; */

  }

  //#################################################
  //TRAE DATOS DEL CATALOGO DE OBJETIVOS AINEACION//
  //################################################
  listObjetivo() {
    this.objetivoService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataObjetivo = resp;
        //console.log('idSprAmbiente: ', this.dataObjetivo);
        this.listDataEstrategiasObjetivos()
      })
  }
  listDataEstrategiasObjetivos() {
    this.estrategiaObjetivosService.list()
      .subscribe(resp => {
        this.dataEstrategiasObjetivos = resp;
        //console.log('dataEstrategiasObjetivos: ', this.dataEstrategiasObjetivos);
        this.listEstrategia();
      })
  }
  listEstrategia() {
    this.estrategiaService.list()
      .subscribe(resp => {
        this.dataEstrategiasMain = resp;
        this.dataEstrategias = resp;
        this.mapearDataEstrategiasObjetivos()
      })
  }

  mapearDataEstrategiasObjetivos() {
    let dataProcess: any = [];
    for (let i = 0; i < this.dataObjetivo.length; i++) {
      for (let j = 0; j < this.dataEstrategiasObjetivos.length; j++) {
        if (this.dataObjetivo[i].idSprObjetivo == this.dataEstrategiasObjetivos[j].idSprObjetivo) {
          for (let k = 0; k < this.dataEstrategias.length; k++) {
            if ((this.dataEstrategias[k].idSprEstrategia == this.dataEstrategiasObjetivos[j].idSprEstrategia) && (this.dataEstrategiasObjetivos[j].nivelSuperior == 'N')) {
              dataProcess.push({
                idSprEstrategia: this.dataEstrategias[j].idSprEstrategia,
                nombre: this.dataEstrategias[j].nombre,
                estado: this.dataEstrategias[j].estado,
              });
            }
          }
        }

      }
    }
    this.dataEstrategiasProcess = dataProcess;
    //console.log('Estrategia: this nivel ', this.dataEstrategiasProcess);
  }

  listDataProcesos() {
    this.procesoService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataProcesos = resp;

        this.getDataParticipanteElementos();
      })
  }
  getDataParticipanteElementos() {
    this.participanteElementoService.list('?estado=1').subscribe(resp => {
      this.dataElementosParticpantes = resp;
      console.log('Particip-elemento: ', this.dataElementosParticpantes);
      this.mapeoProcesosParticipante();
    });
  }

  mapeoProcesosParticipante() {
    let dataProcess = [];
    for (let i = 0; i < this.dataProcesos.length; i++) {
      for (let j = 0; j < this.dataElementosParticpantes.length; j++) {
        if (this.dataProcesos[i].idSprProceso === this.dataElementosParticpantes[j].idSprProceso) {
          for (let k = 0; k < this.dataEquipoGerencial.length; k++) {
            if (this.dataElementosParticpantes[j].idSprEquipoGerencial === this.dataEquipoGerencial[k].idSprEquipoGerencial) {
              this.dataProcesos[i].gradoNombres = this.dataEquipoGerencial[k].gradoNombres;
              this.dataProcesos[i].idSprEquipoGerencial = this.dataElementosParticpantes[j].idSprEquipoGerencial;
              this.dataProcesos[i].idSprParticipanteElemento = this.dataElementosParticpantes[j].idSprParticipanteElemento;
            }
          }
        }
      }
    }
    //this.dataResponsableProceso = dataProcess;
    console.log('Data procesos-particip: ', this.dataProcesos);

  }


  listAreas() {
    this.areaServcie.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataAreas = resp;
        //console.log('Areas Ambiente: ', this.dataAreas);
        this.setDataAreasChecked();
      })
  }

  listEquipoGerencial() {
    console.log('idEquipo gerencial: ', this.idSprAmbiente);
    this.equipoGerencialService.list('?idSprAmbiente=' + this.idSprAmbiente).subscribe(dataEquipoGerencial => {
      this.dataEquipoGerencial = dataEquipoGerencial;
      this.getTipoParticipacion();
    })
  }

  getTipoParticipacion() {
    this.comunService.list("?spr_idSprComun=271").subscribe(respTipoParticipa => {
      this.dataTipoParticpacion = respTipoParticipa;
      //console.log('TIpo participa: ',this.dataTipoParticpacion );
      this.mapeoEquipoGerencialTipoParticipa();
    })
  }

  mapeoEquipoGerencialTipoParticipa() {
    let dataProcess = [];
    for (let i = 0; i < this.dataEquipoGerencial.length; i++) {
      for (let j = 0; j < this.dataTipoParticpacion.length; j++) {
        if (this.dataEquipoGerencial[i].idSprTipoParticipante === this.dataTipoParticpacion[j].idSprComun && this.dataEquipoGerencial[i].estado == 1 &&  this.dataEquipoGerencial[i].idSprTipoParticipante != this.tipoParticipacion ) {
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

  onChange(event: any) { //boton chekbox
    const idSprArea = (this.formProceso.controls['idSprArea'] as FormArray);
    if (event.target.checked) {
      idSprArea.push(new FormControl(event.target.value));
      //console.log(event.target.value)
    } else {
      const index = idSprArea.controls
        .findIndex(x => x.value === event.target.value);
      idSprArea.removeAt(index);
    }
    console.log('Checked: ', this.formProceso.value.idSprArea);
  }


  addItemChecked(arreglo: any) {
    //vaciar el arreglo
    const idsSprArea: FormArray = this.formProceso.get('idSprArea') as FormArray;
    idsSprArea.removeAt(null);
    for (let i = 0; i < arreglo.length; i++) {
      const idSprArea: FormArray = this.formProceso.get('idSprArea') as FormArray;
      idSprArea.push(new FormControl(arreglo[i].idSprArea + " "));
    }
    console.log('Arreglo Checked: ', this.formProceso.value.idSprArea);
  }

  //################################################
  //TRAE DATOS DEL CATALOGO COMUN TIPO DE CLIENTES//
  //###############################################
  listTipoCliente() {
    this.comunService.list()
      .subscribe(resp => {
        this.dataCatComun = this.getDataDependiente(resp, this.idRecursivoCliente);
        this.mapearDataComunes()

      })
  }
  //#################################################
  //TRAE DATOS DEL CATALOGO ESPECIAL UNO TIPO DE PROCESOS//
  //################################################
  listTipoProceso() {
    this.especialUnoService.list()
      .subscribe(resp => {
        this.dataTipoProceso = this.getDataDependienteEspecialUno(resp, this.idRecursivoProceso);

      })
  }
  //##################################################
  //TRAE DATOS DEL CATALOGO COMUN MEJORAS//
  //#################################################
  listMejoras() {
    this.comunService.list()
      .subscribe(resp => {
        this.dataMejoras = this.getDataDependiente(resp, this.idRecursivoMejoras);
        this.mapearDataComunes()
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

  mapearDataComunes() {
    for (let i = 0; i < this.dataProcesos.length; i++) {
      for (let j = 0; j < this.dataTipoProceso.length; j++) {
        if ((this.dataTipoProceso[j].idSprComun === this.dataProcesos[i].idSprTipoProceso)) {
          for (let k = 0; k < this.dataCatComun.length; k++) {
            if ((this.dataCatComun[k].idSprComun === this.dataProcesos[i].idSprTipoCliente)) {
              for (let m = 0; m < this.dataMejoras.length; m++) {
                if ((this.dataMejoras[m].idSprComun === this.dataProcesos[i].idSprMejoras)) {
                  for (let p = 0; p < this.dataCatEspecialUno.length; p++) {
                    if ((this.dataCatEspecialUno[p].idSprEspecialUno === this.dataProcesos[i].idSprTipoProceso)) {
                      this.dataProcesos[i].tipoProceso = this.dataTipoProceso[j].nombre;
                      this.dataProcesos[i].tipoCliente = this.dataCatComun[k].nombre;
                      this.dataProcesos[i].mejoras = this.dataMejoras[m].nombre;
                    }
                    //console.log("Data TipoProceso: ", this.dataTipoProceso)
                  }
                }
              }
            }
          }
        }
      }
    }
    //console.log("Data proceso-tipocliente: ", this.dataProceso)
  }

  modalElemDetalles(obj: Proceso) {
    this.modal.open(this.modalEle);
    this.modalPlanAccion = obj;

    this.formProceso.patchValue({
      idSprProceso: obj.idSprProceso,
    });
    this.idProceso = obj.idSprProceso;
  }

  elementos(obj: Proceso) {
    this.modalElementos = true
    this.formProceso.patchValue({
      idSprProceso: obj.idSprProceso,
      fechaInicio: obj.fechaInicio,
      fechaFin: obj.fechaFin,
      estado: obj.estado,
    });
    this.idProceso = obj.idSprProceso;
    console.log("ID ´proceso....:", this.idProceso)
  }

  // Modal Crear/editar
  openModal() {
    this.dataAreasChecked = [];
    this.onResetForm(),
      //  this.setDataAreasChecked();
      this.modal.open(this.nameModal);
  }

  openModalDesempenio() {
    this.onResetForm();
    this.modal.open(this.nameModal1);
  }
  // Resetear el formulario
  //################################################
  onResetForm() {
    console.log('Reseteando formulario: ');
    this.formSubmitted = false;
    this.formProceso.reset();
  }
}