import { Proyecto } from './../../models/proyecto';
import { ProyectoService } from '../../services/proyecto.service';
import { AreaElementoService } from '../../services/area.elemento.service';
import { AreaService } from './../../../catalogos-admin/services/area.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, FormArray, FormControl } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { DataTableDirective } from 'angular-datatables';
import { ObjetivoService } from '../../services/objetivo.service';
import { EstrategiasService } from '../../services/estrategias.service';
import { ComunService } from 'src/app/modulos/catalogos-proces/services/comun.service';
import { EquipoGerencialService } from 'src/app/modulos/catalogos-proces/services/equipo.gerencial.service';
import { Subject, forkJoin, mergeMap } from 'rxjs';
import { EstrategiaObjetivoService } from '../../services/estrategia-objetivo.service';
import { ParticipanteElementoService } from '../../services/participante.elemento.service';
import { DatePipe } from '@angular/common';
import { AmbienteService } from 'src/app/modulos/catalogos-proces/services/ambiente.service';


@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit, OnDestroy {
  breadCrumbItems = [{ label: 'Formulación' }, { label: 'Planes' }, { label: 'Proyectos', active: true }];

  public formProyecto!: UntypedFormGroup;
  public formSubmitted = false;
  public currentAmbiente: any;
  public ipAddress!: string;
  public buffer: any;
  public dataProyectos: any[] = [];
  public dataObjetivo!: any;// trae data de objetivos
  public dataAreas!: any;// trae data de areas del Ambiente
  public dataAreasProcess!: any;
  public participanteElemento: any = [];
  public dataResponsableProyecto: any = [];
  public dataEstrategias!: any;
  public dataCatComun!: any;// trae data catalogo comun
  public dataTipoProyecto!: any;// trae data catalogo comun tipo de proyecto
  public dataEstrategiasObjetivos: any = [];// trae data catalogo comun tipo de proyecto
  public dataEstrategiasProcess: any = [];// trae data catalogo comun tipo de proyecto
  public dataViabilidadTecnica!: any;// trae data catalogo comun viabilidad tecnica
  public dataEstrategiasMain!: any;// trae data de estrategias
  public dataParticipanteElem!: any;
  public dataTipoParticpacion!: any;
  public nombreUnidad!: any;
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameModal1: string = 'modalNewupdate1'
  public nameModal: string = 'modalProyecto'
  public desripcionProyecto!: any;
  public nameApp = 'Proyectos';
  public idSprAmbiente!: number;
  public idSprProyecto!: number;
  public idSprNivel5: number = 287;
  public idSprNivel: number = 0;
  public nivelSelect!: number;
  public idRecursivoCliente: number = 220;
  public idRecursivoProyecto: number = 228;
  public idRecursivoViabilidad: number = 223;
  public dataEquipoGerencial!: any;
  public dataElementosParticpantes: any = [];
  public dataAreasChecked: any = []; //data para Area
  public dataTitulares: any = []; //data para Titluares unidad
  idSprComunRolLiderProyecto: number = 274;
  idSprComunRolTitular: number = 296;
  public idSprTipoParticipante = 293;// id para guardar unicamente de participantes
  inputs = [{ nombre: '', cedula: '', idSprTipoParticipante: this.idSprComunRolLiderProyecto }];
  hoy = new Date();
  pipe = new DatePipe('en-US');
  inputsP = [{ value: '' }];
  modalOpen = false;
  editHito: boolean = false;
  areaElementoGuardado = [];
  public hito = [];
  participantesNuevos = [];
  inputsAnteriores = [];
  public participanteElementoAeliminar = [];
  public guardarEquipoGerencialSeleccionado: any;
  public patrocinadorOriginal: any;
  public grados = [
    "CRNEL.",
    "TNTE.CRNEL.",
    "MAYR.",
    "CPTN.",
    "TNTE.",
    "SBTE.",
    "SBOM.",
    "SBOP.",
    "SBOS.",
    "SGTOP.",
    "SGTOS.",
    "CBOP.",
    "CBOS.",
    "POLI."];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;


  constructor(
    private fb: FormBuilder,
    private proyectoService: ProyectoService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService,
    private objetivoService: ObjetivoService,
    private comunService: ComunService,
    private areaServcie: AreaService,
    private equipoGerencialService: EquipoGerencialService,
    private areaELemService: AreaElementoService,
    private estrategiaService: EstrategiasService,
    private estrategiaObjetivosService: EstrategiaObjetivoService,
    private participanteElementoService: ParticipanteElementoService,
    private ambienteService: AmbienteService,
  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.currentAmbiente = JSON.parse(this.buffer);
    this.nombreUnidad = this.currentAmbiente.nombreUnidad;
    this.selectItems = [
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
    this.idSprAmbiente = this.currentAmbiente.idSprAmbiente;
    console.log('Formurio invalido'+    this.idSprAmbiente);
    console.log('Formurio'+    this.idSprProyecto);
    this.idSprNivel = this.currentAmbiente.idSprNivel;
  }

  get proyectoForm() {
    return this.formProyecto.controls;
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
    this.formProyecto = this.fb.group({
      idSprProyecto: [],
      idSprArea: new FormArray([]),
      idSprObjetivo: [],
      idSprEstrategia: [],
      idSprTipoProyecto: ['', [Validators.required]],
      idSprAmbiente: [],
      idSprTitular: ['', [Validators.required]],
      idSprViabilidadTecnica: [],
      idSprParticipanteElemento: ['', []],
      idSprEquipoGerencialAnterior: ['', []],
      idSprEquipoGerencial: ['', [Validators.required]],
      nombreProyecto: ['', [Validators.required]],
      descripcion: [],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      beneficiosCualitativos: [],
      restricciones: [],
      numContratoPrincipal: [],
      fechaFirma: ['', [Validators.required]],
      idSprTipoCliente: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      /********set participantes ************/
      cedula: ['', [Validators.required]],
      grado: ['', [Validators.required]],
      nombreParticipante: ['', [Validators.required]],
      fechaInicioParticipante: ['', [Validators.required]],
      fechaFinParticipante: ['', []],
      estadoParticipa: ['', []],
      /********Fin set participantes ************/
    });
  }

  initApp() {
    this.setDataTable();
    this.setForm();
    this.listDataProyectos();
    this.listObjetivo();
    this.listAreas();
    this.listTipoCliente();
    this.listTipoProyecto();
    this.listViabilidadTecnica();
    this.listEquipoGerencial();

  }
  ngOnInit(): void {
    this.nivelSelect = this.currentAmbiente.idSprNivel
    this.getIpPublic();
    this.initApp();
    //console.log('Niveles', this.idSprNivel, " ", this.idSprNivel5);
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
    this.formProyecto.get("grado").clearValidators()
    this.formProyecto.get("grado").updateValueAndValidity()

    this.formProyecto.get("nombreParticipante").clearValidators()
    this.formProyecto.get("nombreParticipante").updateValueAndValidity()

    this.formProyecto.get("cedula").clearValidators()
    this.formProyecto.get("cedula").updateValueAndValidity()

    this.formProyecto.get("fechaInicioParticipante").clearValidators()
    this.formProyecto.get("fechaInicioParticipante").updateValueAndValidity()

    this.formProyecto.get("fechaFinParticipante").clearValidators()
    this.formProyecto.get("fechaFinParticipante").updateValueAndValidity()


    let stateInsert: boolean = false;
    let idSprProyectoInsertado: number = 0;
    let idSprProyecto = this.formProyecto.value.idSprProyecto;
    let idSprUsuario = this.currentAmbiente.idSprUsuario;
    this.formProyecto.value.usuario = this.currentAmbiente.idSprUsuario;
    this.formProyecto.value.ip = this.ipAddress;
    this.formProyecto.value.idSprAmbiente = this.currentAmbiente.idSprAmbiente;
    this.formProyecto.value.nombreProyecto = this.formProyecto.value.nombreProyecto.toUpperCase();
    this.crearParticipantes(this.formProyecto.value.idSprProyecto)
    this.formSubmitted = true;
    //console.log('data Guardar: ', this.formProyecto.value);
    //return true;
    if (this.formProyecto.valid) {
      //Realizar el posteo
      if (this.idSprNivel != this.idSprNivel5) {
        this.formProyecto.value.idSprObjetivo = null;
      }

      if (this.formProyecto.value.idSprProyecto == null || this.formProyecto.value.idSprProyecto == " ") {

        let idsAreas = this.formProyecto.value.idSprArea
        this.proyectoService.create(this.formProyecto.value).subscribe(
          dataProyectoResponse => {
            console.log('Proyecto: ', dataProyectoResponse);
            stateInsert = true;
            idSprProyectoInsertado = dataProyectoResponse.idSprProyecto;
            for (let idsArea of idsAreas) {
              let dataAreas = {
                idSprProyecto: dataProyectoResponse.idSprProyecto,
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
                idSprEquipoGerencial: this.formProyecto.value.idSprEquipoGerencial,
                fechaInicio: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
                usuario: this.currentAmbiente.idSprUsuario,
                idSprProyecto: idSprProyectoInsertado,
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
        let idsAreasDeFormulario = this.formProyecto.value.idSprArea;
        this.formProyecto.value.ip = this.ipAddress;
        this.formProyecto.value.idSprAmbiente = this.currentAmbiente.idSprAmbiente;
        this.formProyecto.value.usuario = this.currentAmbiente.idSprUsuario;
        let dataFormulario = this.formProyecto.value;

        //console.log('editHitoando...............1: ', dataFormulario);
        stateInsert = true;
        // Caso contrario: para actualizar items de procesos
        let idsAreasProyectosActuales;
        this.areaELemService.list(`?idSprProyecto=${this.formProyecto.value.idSprProyecto}`).subscribe(dataAreaElementosActuales => {
          idsAreasProyectosActuales = dataAreaElementosActuales;
          //console.log('editHitoando................: ', dataFormulario );
          // Actualizacion a la tabla procesos
          this.proyectoService.update(dataFormulario).subscribe(data => {
            let insertarNuevo: boolean = true;

            // Verificamos si existe areas nuevas q agregar
            //console.log('seelccioandas -> exsitentes: ', idsAreasDeFormulario.length + " ==> "+ idsAreasProcesosActuales.length );
            if (idsAreasDeFormulario.length >= idsAreasProyectosActuales.length) {
              //console.log('Agregar areas nuevas: ' );
              for (let i = 0; i < idsAreasDeFormulario.length; i++) {
                for (let j = 0; j < idsAreasProyectosActuales.length; j++) {
                  if (idsAreasProyectosActuales[j].idSprArea == idsAreasDeFormulario[i] && idsAreasProyectosActuales[j].estado == 1) {
                    // Si existe el sprAreaProceso
                    insertarNuevo = false;
                  }
                }
                if (insertarNuevo) {
                  let dataAreaProcesoCreate = {
                    idSprProyecto: idSprProyecto,
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
              for (let j = 0; j < idsAreasProyectosActuales.length; j++) {
                for (let i = 0; i < idsAreasDeFormulario.length; i++) {

                  if (idsAreasProyectosActuales[j].idSprArea == idsAreasDeFormulario[i]) {
                    deleteConfirm = true;
                  }
                }
                if (!deleteConfirm) {
                  let dataAreaProcesoCreate = {
                    idSprAreaElemento: idsAreasProyectosActuales[j].idSprAreaElemento,
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
          });// Fin editHito proceso
        }, (err) => {
          stateInsert = false;
        });// FIn list areaElementos

        // Gestion responsable-proceso
        if (this.formProyecto.value.idSprEquipoGerencial != this.formProyecto.value.idSprEquipoGerencialAnterior) {
          let estadoParticipante: boolean = true;

          // Desabilitando responsable anterior
          if (this.formProyecto.value.idSprEquipoGerencialAnterior != null) {
            let dataParticipanteELemento = {
              idSprParticipanteElemento: this.formProyecto.value.idSprParticipanteElemento,
              fechaFin: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
              usuario: idSprUsuario, ip: this.ipAddress, estado: 2
            }
            //console.log('Participante-anterior desabilitar: ', dataParticipanteELemento);

            this.participanteElementoService.update(dataParticipanteELemento).subscribe(responseResponsable => {
              //console.log('Desabilitado responsable anterior: ', responseResponsable);
            }, (err) => {
              estadoParticipante = false;
              stateInsert = false;
            });//FIn editHito participante-elemento
          }// Fin si idParticipante anterior no es nulo

          if (estadoParticipante) {
            let dataParticipElemento = {
              idSprEquipoGerencial: this.formProyecto.value.idSprEquipoGerencial,
              fechaInicio: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
              usuario: this.currentAmbiente.idSprUsuario,
              idSprProyecto: idSprProyecto,
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
                this.crearParticipantes(this.formProyecto.value.idSprProyecto
                )
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

  edit(obj: any) {
    console.log('Data edit: ', obj);
    this.onResetForm();
    this.openModal();
    this.areaELemService.list("?idSprProyecto=" + obj.idSprProyecto).subscribe(response => {
      this.dataAreasChecked = response;
      console.log('Areas: ', response);
      this.getDataParticipanteElemento();
      this.setDataAreasChecked();
      this.addItemChecked(response);
    })

    //this.addItemChecked(obj.areas);
    console.log('Areas recuperadas para updatear: ', this.dataAreasChecked, "Cant: ", this.dataAreasChecked.length);
    this.formProyecto.patchValue({
      idSprProyecto: obj.idSprProyecto,
      idSprObjetivo: obj.idSprObjetivo,
      idSprEstrategia: obj.idSprEstrategia,
      idSprViabilidadTecnica: obj.idSprViabilidadTecnica,
      idSprTipoProyecto: obj.idSprTipoProyecto,
      idSprTipoCliente: obj.idSprTipoCliente,
      idSprAmbiente: obj.idSprAmbiente,
      idSprArea: obj.idSprArea,
      idSprEquipoGerencial: obj.idSprEquipoGerencial,
      idSprEquipoGerencialAnterior: obj.idSprEquipoGerencial,
      idSprParticipanteElemento: obj.idSprParticipanteElemento,
      idSprTitular: obj.idSprTitular,
      nombreProyecto: obj.nombreProyecto,
      descripcion: obj.descripcion,
      fechaInicio: obj.fechaInicio,
      fechaFin: obj.fechaFin,
      beneficiosCualitativos: obj.beneficiosCualitativos,
      restricciones: obj.restricciones,
      numContratoPrincipal: obj.numContratoPrincipal,
      fechaFirma: obj.fechaFirma,
      estado: obj.estado,
    });
  }



  delete(idRegister: number) {
    this.modal.open('delete-proyecto');
    this.idDeleteRegister = idRegister;
  }

  confirmDelete() {
    let errorDeleteState: boolean = false;
    let dataDeleteAreElementos = { usuario: this.currentAmbiente.idSprUsuario, idSprAreaElemento: 0, ip: this.ipAddress, delLog: 'S' }

    let dataDeleteParticipElementos = { usuario: this.currentAmbiente.idSprUsuario, idSprParticipanteElemento: 0, ip: this.ipAddress, delLog: 'S' }
    let dataDeleteProyecto = { idSprProyecto: this.idDeleteRegister, usuario: this.currentAmbiente.idSprUsuario, ip: this.ipAddress, delLog: 'S' }
    if (this.idDeleteRegister > 0) {
      this.ambienteService.list(`?idSprProyecto=${this.idDeleteRegister}&delLog=N`)
      this.objetivoService.list(`?idSprProyecto=${this.idDeleteRegister}&delLog=N`)
      this.estrategiaService.list(`?idSprProyecto=${this.idDeleteRegister}&delLog=N`)
      this.areaServcie.list(`?idSprProyecto=${this.idDeleteRegister}&delLog=N`)
      let areasELementos = [];
      let participantesElementos = [];
      this.participanteElementoService.list(`?idSprProyecto=${this.idDeleteRegister}`).subscribe(response => {
        participantesElementos = response;
        this.areaELemService.list(`?idSprProyecto=${this.idDeleteRegister}`).subscribe(response => {
          areasELementos = response;
          // Foreach 1
          areasELementos.forEach(itemAreaElement => {
            dataDeleteAreElementos.idSprAreaElemento = itemAreaElement.idSprAreaElemento;
            this.areaELemService.delete(dataDeleteAreElementos).subscribe({
              next: responseDelete => {

                console.log('Eliminado 1 Ok: ', responseDelete);
              },
              error: (error) => {
                errorDeleteState = true; errorDeleteState = true;
                dataDeleteProyecto.delLog = 'N';
                this.proyectoService.delete(dataDeleteProyecto).subscribe({
                  next: responseDelete => {
                    console.log('Reversado proyecto ok: ', responseDelete);
                  },
                  error: (error) => {
                    errorDeleteState = true;
                    console.log('Ocurrio un error al reversar proyecto: ', error);
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

                this.proyectoService.delete(dataDeleteProyecto).subscribe({
                  next: responseDelete => {

                    console.log('Eliminado proyecto Ok: ', responseDelete);
                  },
                  error: (error) => {
                    errorDeleteState = true;
                    console.log('Ocurrio un error al eliminar 1: ', error);
                  }
                })

              },
              error: (error) => {
                errorDeleteState = true;
                dataDeleteProyecto.delLog = 'N';
                this.proyectoService.delete(dataDeleteProyecto).subscribe({
                  next: responseDelete => {
                    console.log('Reversado proyecto ok: ', responseDelete);
                  },
                  error: (error) => {
                    errorDeleteState = true;
                    console.log('Ocurrio un error al reversar proyecto: ', error);
                  }
                })
                console.log('Ocurrio un error al eliminar particp-elem: ', error);
              }
            })
          });// Fin forEach 2

          this.participanteElementoService.list("?idSprProyecto" + this.idDeleteRegister).subscribe(
            res => {
              res.forEach(participantesElemento => {
                this.participanteElementoService.delete(participantesElemento).subscribe()
              })
            }
          )

        });
      });
    }
    if (!errorDeleteState) {
      this.initApp();
      this.alert.deleteOk();
      this.modal.close();
    } else {
      this.alert.warning("Atención", "Ocurrió un error al intentar borrar el registro");
      this.alert.deleteError();
    }
  }

  hitoInit(obj: any) {
    this.desripcionProyecto = obj.nombreProyecto;
    //console.log('Desempenio: ', obj);
    this.hito = obj;
    //this.dese
    this.openModalHito();
  }

  ///////TRAE DATOS DE OBJETIVOS/////////////////
  listObjetivo() {
    this.objetivoService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataObjetivo = resp;
        this.listDataEstragegiasObjetivos();

      })
  }

  ////////TRAE DATOS DE ESTRATEGIAS OBJETIVOS////////////////
  listDataEstragegiasObjetivos() {
    this.estrategiaObjetivosService.list()
      .subscribe(resp => {
        this.dataEstrategiasObjetivos = resp;
        //console.log('dataEstrategiasObjetivos: ', this.dataEstrategiasObjetivos);
        this.listEstrategia();
        //this.mapearDataEstrategiasObjetivos();
      })
  }
  ////////TRAE DATOS DE ESTRATEGIAS ALINEACION////////
  listEstrategia() {
    this.estrategiaService.list()
      .subscribe(resp => {
        this.dataEstrategiasMain = resp;
        this.dataEstrategias = resp;
        this.mapearDataEstrategiasObjetivo()

      })
  }
  ///////MAPEO DE LAS TRES DATAS OBJETIVO ESTROBJETIVO ESTRATEGIA/////////
  mapearDataEstrategiasObjetivo() {
    let dataProcess: any = [];
    for (let i = 0; i < this.dataObjetivo.length; i++) {
      for (let j = 0; j < this.dataEstrategiasObjetivos.length; j++) {
        if (this.dataObjetivo[i].idSprObjetivo == this.dataEstrategiasObjetivos[j].idSprObjetivo) {

          for (let k = 0; k < this.dataEstrategias.length; k++) {
            if ((this.dataEstrategias[k].idSprEstrategia === this.dataEstrategiasObjetivos[j].idSprEstrategia) && (this.dataEstrategiasObjetivos[j].nivelSuperior === 'N')) {
              dataProcess.push({
                idSprEstrategia: this.dataEstrategias[k].idSprEstrategia,
                nombre: this.dataEstrategias[k].nombre,
                estado: this.dataEstrategias[k].estado,
              });
            }
          }
        }
      }
    }
    this.dataEstrategiasProcess = dataProcess;
    //console.log('Estrategia: this nivel ', this.dataEstrategiasProcess);
  }
  //////////////TRAE DATOS DE PROYECTOS///////////////////
  listDataProyectos() {
    this.proyectoService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataProyectos = resp;
        this.getDataParticipanteElementos();
      })
  }
  getDataParticipanteElemento() {
    this.participanteElementoService.list('?idSprProyecto=' + this.idSprProyecto).subscribe((res: any) => {
      this.participanteElemento = res
      let participanteElementoPatrocinador: any
      this.inputsAnteriores = []
      res.forEach(participante => {

        this.equipoGerencialService.getById(participante.idSprEquipoGerencial).subscribe((resi: any) => {
          console.log("donde esta la falla", resi)
          if (resi.idSprTipoParticipante === 293) {

            this.inputsAnteriores.push({ ...resi, participanteElemento: participante })

          }
          else {
            console.log("538", resi)
            this.patrocinadorOriginal = participante
            participanteElementoPatrocinador = resi
            this.guardarEquipoGerencialSeleccionado = resi

            this.formProyecto.patchValue({
              ...this.formProyecto.value,
              idSprEquipoGerencial: resi.idSprEquipoGerencial
            })
            this.formProyecto.value.idSprEquipoGerencial = resi.idSprEquipoGerencial
          }
        })
      })
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
    for (let i = 0; i < this.dataProyectos.length; i++) {
      for (let j = 0; j < this.dataElementosParticpantes.length; j++) {
        if (this.dataProyectos[i].idSprProyecto === this.dataElementosParticpantes[j].idSprProyecto) {
          for (let k = 0; k < this.dataEquipoGerencial.length; k++) {



            if (this.dataElementosParticpantes[j].idSprEquipoGerencial === this.dataEquipoGerencial[k].idSprEquipoGerencial) {
              this.dataProyectos[i].gradoNombres = this.dataEquipoGerencial[k].gradoNombres;
              this.dataProyectos[i].idSprEquipoGerencial = this.dataElementosParticpantes[j].idSprEquipoGerencial;
              this.dataProyectos[i].idSprParticipanteElemento = this.dataElementosParticpantes[j].idSprParticipanteElemento;
            }

          }
        }
      }
    }
    console.log('dataProyectos: ', this.dataProyectos);
  }

  ////////////TRAE DATOS DE EQUIPO GERENCIAL/////////
  listEquipoGerencial() {
    console.log('idEquipo gerencial: ', this.idSprAmbiente);
    this.equipoGerencialService.list('?idSprAmbiente=' + this.idSprAmbiente).subscribe(dataEquipoGerencial => {
      this.dataEquipoGerencial = dataEquipoGerencial;
      this.getTipoParticipacion();
    })
  }
  /////////////TRAE DATOS TIPO PARTICIPANTE///////////
  getTipoParticipacion() {
    this.comunService.list("?spr_idSprComun=271").subscribe(respTipoParticipa => {
      this.dataTipoParticpacion = respTipoParticipa;
      //console.log('TIpo participa: ',this.dataTipoParticpacion );
      this.mapeoEquipoGerencialTipoParticipa();
    })
  }

  mapeoEquipoGerencialTipoParticipa() {
    let dataProcess = [];
    let titulares = [];
    for (let i = 0; i < this.dataEquipoGerencial.length; i++) {
      for (let j = 0; j < this.dataTipoParticpacion.length; j++) {


        if (this.dataEquipoGerencial[i].idSprTipoParticipante === this.dataTipoParticpacion[j].idSprComun && this.dataEquipoGerencial[i].estado == 1 && this.dataEquipoGerencial[i].idSprTipoParticipante == this.idSprComunRolLiderProyecto) {
          dataProcess.push({
            idSprEquipoGerencial: this.dataEquipoGerencial[i].idSprEquipoGerencial,
            nombres: this.dataEquipoGerencial[i].gradoNombres,
            cedula: this.dataEquipoGerencial[i].cedula,
            participacion: this.dataTipoParticpacion[j].nombre
          })
        }

        if (this.dataEquipoGerencial[i].idSprTipoParticipante === this.dataTipoParticpacion[j].idSprComun && this.dataEquipoGerencial[i].estado == 1 && this.dataEquipoGerencial[i].idSprTipoParticipante == this.idSprComunRolTitular) {
          titulares.push({
            idSprTitular: this.dataEquipoGerencial[i].idSprEquipoGerencial,
            nombres: this.dataEquipoGerencial[i].gradoNombres,
            cedula: this.dataEquipoGerencial[i].cedula,
            participacion: this.dataTipoParticpacion[j].nombre
          })
        }
      }

    }
    this.dataResponsableProyecto = dataProcess;
    this.dataTitulares = titulares;

  }



  ////////////TRAE DATOS DE AREAS/////////////////////
  listAreas() {
    this.areaServcie.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataAreas = resp;
        console.log('Areas Ambiente: ', this.dataAreas);
        this.setDataAreasChecked();
      })
  }
  ////////TRAE DATOS DEL CATALOGO COMUN TIPO DE CLIENTES//////////////
  listTipoCliente() {
    this.comunService.list()
      .subscribe(resp => {
        this.dataCatComun = this.getDataDependiente(resp, this.idRecursivoCliente);
        this.mapearDataComunes()

      })
  }
  ///////////TRAE DATOS DEL CATALOGO COMUN TIPO DE PROYECTOS/////////////////
  listTipoProyecto() {
    this.comunService.list()
      .subscribe(resp => {
        this.dataTipoProyecto = this.getDataDependiente(resp, this.idRecursivoProyecto);
        this.mapearDataComunes()
      })
  }
  ////////////TRAE DATOS DEL CATALOGO COMUN VIABILIDAD TECNICA//////////////////
  listViabilidadTecnica() {
    this.comunService.list()
      .subscribe(resp => {
        this.dataViabilidadTecnica = this.getDataDependiente(resp, this.idRecursivoViabilidad);
        this.mapearDataComunes()
      })
  }
  //////////////DEPENDIENTE DEL CATALOGO COMUN///////////////////////////////
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
  //////////////MAPEO DE DATOS DEL CATALOGO COMUN//////////////////////////////////
  mapearDataComunes() {
    for (let i = 0; i < this.dataProyectos.length; i++) {
      for (let j = 0; j < this.dataTipoProyecto.length; j++) {
        if ((this.dataTipoProyecto[j].idSprComun === this.dataProyectos[i].idSprTipoProyecto)) {

          for (let k = 0; k < this.dataCatComun.length; k++) {
            if ((this.dataCatComun[k].idSprComun === this.dataProyectos[i].idSprTipoCliente)) {

              for (let m = 0; m < this.dataViabilidadTecnica.length; m++) {
                if ((this.dataViabilidadTecnica[m].idSprComun === this.dataProyectos[i].idSprViabilidadTecnica)) {


                  this.dataProyectos[i].tipoProyecto = this.dataTipoProyecto[j].nombre;
                  this.dataProyectos[i].tipoCliente = this.dataCatComun[k].nombre;
                  this.dataProyectos[i].viabilidad = this.dataViabilidadTecnica[m].nombre;
                }
                //console.log("Data TipoProyecto: ", this.dataTipoProyecto)
              }
            }
          }
        }
      }
    }
    //console.log("Data proyecto-tipocliente: ", this.dataProyecto)
  }
  onChange(event: any) { //boton chekbox
    const idSprArea = (this.formProyecto.controls['idSprArea'] as FormArray);
    if (event.target.checked) {
      idSprArea.push(new FormControl(event.target.value));
      //console.log(event.target.value)
    } else {
      const index = idSprArea.controls
        .findIndex(x => x.value === event.target.value);
      idSprArea.removeAt(index);
    }
    console.log('Checked: ', this.formProyecto.value.idSprArea);
  }


  addItemChecked(arreglo: any) {
    //vaciar el arreglo
    const idsSprArea: FormArray = this.formProyecto.get('idSprArea') as FormArray;
    idsSprArea.removeAt(null);
    for (let i = 0; i < arreglo.length; i++) {
      const idSprArea: FormArray = this.formProyecto.get('idSprArea') as FormArray;
      idSprArea.push(new FormControl(arreglo[i].idSprArea + " "));
    }
    console.log('Arreglo Checked: ', this.formProyecto.value.idSprArea);
  }

  crearParticipantes(idSprProyecto: number) {
    this.participantesNuevos.forEach(participante => {
      let equipoGerencial = {
        idSprAmbiente: this.currentAmbiente.idSprAmbiente,
        idSprTipoParticipante: this.idSprTipoParticipante,
        cedula: participante.cedula,
        gradoNombres: `${participante.grado}. ${participante.nombre}`,
        fechaInicio: participante.fechaInicial,
        fechaFin: null,
        estado: this.formProyecto.value.estado,
        ip: this.ipAddress,
        usuario: this.currentAmbiente.idSprUsuario,
      }
      console.log("equipoGerencial", equipoGerencial)
      this.equipoGerencialService.create(equipoGerencial).subscribe({
        next: equipoGerencialCreado => {
          let participanteElemento = {

            idSprProyecto: idSprProyecto,
            fechaInicio: participante.fechaInicial,
            fechaFin: null,
            estado: this.formProyecto.value.estado,
            ip: this.ipAddress,
            usuario: this.currentAmbiente.idSprUsuario,
            idSprEquipoGerencial: equipoGerencialCreado.idSprEquipoGerencial,

          }
          console.log("participanteElemento", participanteElemento)
          this.participanteElementoService.create(participanteElemento).subscribe({
            next: () => {

            },
            error: () => {
              this.equipoGerencialService.delete(equipoGerencialCreado).subscribe()
            }

          })

        }
      })

    })

  }

  pushParticipante() {
    if (this.formProyecto.controls["nombreParticipante"].invalid ||
      this.formProyecto.controls["grado"].invalid ||
      this.formProyecto.controls["cedula"].invalid ||
      this.formProyecto.controls["fechaInicioParticipante"].invalid ||
      this.formProyecto.controls["fechaFinParticipante"].invalid
    ) {
      this.alert.createError();
      return
    }
    this.participantesNuevos.push({
      nombre: this.formProyecto.value.nombreParticipante,
      grado: this.formProyecto.value.grado,
      cedula: this.formProyecto.value.cedula,
      fechaInicial: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
      fechaFinal: this.formProyecto.value.fechaFinParticipante,
      estadoParticipa: this.formProyecto.value.estadoParticipa,
    });
    this.formProyecto.controls["nombreParticipante"].reset()
    this.formProyecto.controls["grado"].reset()
    this.formProyecto.controls["cedula"].reset()
    this.formProyecto.controls["fechaInicioParticipante"].reset()
    this.formProyecto.controls["fechaFinParticipante"].reset()
    this.formProyecto.controls["estadoParticipa"].reset()
  }


  removeInputAnteriores(index: number, obj: any) {
    console.log(obj)
    this.participanteElementoAeliminar.push(obj.participanteElemento)
    this.inputsAnteriores.splice(index, 1);
  }
  // Modal Crear/updatear
  openModal() {
    this.dataAreasChecked = [];
    this.onResetForm(),
      //  this.setDataAreasChecked();
      this.modal.open(this.nameModal);
  }

  openModalNew() {
    this.onResetForm();
    this.modal.open(this.nameModal);
  }
  openModalHito() {
    this.onResetForm();
    this.modal.open(this.nameModal1);
  }

  modalEditClose() {
    this.modal.close();
    this.onResetForm();
    this.dataAreasChecked = [];
    this.initApp();
    this.setDataAreasChecked();
  }

  // Resetear el formulario
  //################################################
  onResetForm() {
    this.formSubmitted = false;
    this.formProyecto.reset();
  }

  addInput() {
    this.inputs.push({ nombre: '', cedula: '', idSprTipoParticipante: 0 });
  }

  removeInput(index: number) {
    this.inputs.splice(index, 1);
  }

}