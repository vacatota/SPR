
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { planesAccionInterface } from '../../models/plan.accion';
import { ObjetivoService } from '../../services/objetivo.service';
import { Objetivo } from '../../models/objetivo';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { AreaElementoService } from '../../services/area.elemento.service';
import { Area } from '../../models/area';
import { PlanAccionService } from '../../services/plan.accion.service';
import { Subject, forkJoin, mergeMap } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { DataTableDirective } from 'angular-datatables';
import { ModalService } from 'src/app/services/modal.service';
import { AreaService } from '../../services/area.service';
import { EquipoGerencialService } from 'src/app/modulos/catalogos-proces/services/equipo.gerencial.service';
import { ParticipanteElementoService } from '../../services/participante.elemento.service';
import { CatComunService } from 'src/app/modulos/catalogos-admin/services/cat-comun.service';
import { LineaAccionService } from '../../services/linea-accion.service';
import { LineaAccionInterface } from '../../models/linea-accion';
import { EstrategiasService } from '../../services/estrategias.service';
import { Estrategias } from '../../models/estrategia';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from "primeng/api";
import { UnidadesSiipneService } from 'src/app/services/unidades-siipne.service';
import { ComunService } from 'src/app/modulos/catalogos-proces/services/comun.service';
import { SubsistemaService } from '../../services/subsistema.service';
import { AmbienteService } from 'src/app/modulos/catalogos-admin/services/ambiente.service';
import { EstrategiaObjetivoService } from '../../services/estrategia-objetivo.service';
import { ProcesoService } from '../../services/proceso.service';
import { DatePipe } from '@angular/common';
import { ActividadesService } from '../../services/actividades.service';

@Component({
  selector: 'app-linea-accion',
  templateUrl: './linea-accion.component.html',
  styleUrls: ['./linea-accion.component.css']
})
export class LineaAccionComponent {
  public mostrarModal: boolean = false;
  public dataLineaAccion: any = [];
  public listaTipoParticipante: any = [];
  public participanteElemento: any = [];
  public dataEstrategia!: any;
  public dataEstrategiaObjetivo!: any;
  public dataObjetivo!: any;
  public dataEstrategiaMap!: any;
  public dataProceso!: any;
  public dataArea!: any;
  public dataEquipoGerencial!: any;
  public dataAreaElementos!: any;
  public submitted = false;
  public formLineaAccion!: FormGroup;
  public patrocinadorOriginal: any;
  buffer!: any;
  currentUser!: any;
  nameUnidad!: any;
  nameArea!: any;
  selecAreas = [];
  public idSprAmbiente: any;
  public nombreObjetivo!: any;
  public currentAmbiente: any;
  public nombreUnidad: any;
  public ipAddress: any;
  public modalElementos: any;
  selectItems: any[] = [];
  nameLineasAccion = 'CREA LINEAS DE ACCIÓN';
  nameDetalles = 'DETALLE PLANES DE ACCIÓN';
  public idLineaAccion: any;
  public modalPlanAccion: any;

  private idDeleteRegister: number = 0;
  public nameModal: string = 'modalPlanAccion';
  public modalEle: string = 'modalEle';
  modalOpen = false;


  areaElementoGuardado = [];
  edit: boolean = false;
  areaAnteriores = [];
  areaElementosOriginales = [];
  public guardarEquipoGerencialSeleccionado: any;
  inputsAnteriores = [];
  public participanteElementoAeliminar = [];
  public spr_idSprComun = 271;
  public idSprTipoParticipante = 293;// id para guardar unicamente de participantes
  public idSprTipoParticipante1 = 274;
  public cont = 0;
  public nombreRuta: any = '';
  participantesNuevos = [];
  public grados = ["Cptn", "Tnte", "Sbte", "Sgop", "Cbop"];
  pipe = new DatePipe('en-US');
  hoy = new Date();

  public dataPersonalElemento!: any;
  public dataLineaAccionEquipo!: any;
  public dataEstrategiaL!: any;
  public dataEstrategiaObjetivoL!: any;
  public dataObjetivoL!: any;
  public dataLineaAccionL!: any;
  public dataPersonalElementoL!: any;
  public dataEquipoGerencialL!: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  unidades: TreeNode[];
  selectedFile: TreeNode;
  formAmbiente: FormGroup;


  constructor(
    private fb: FormBuilder,
    private lineaAccionService: LineaAccionService,
    private ip: IpPublicService,
    private estrategiaService: EstrategiasService,
    private alertService: AlertService,
    private areaElementosService: AreaElementoService,
    private participanteElementoService: ParticipanteElementoService,
    private areaService: AreaService,
    private catComunService: CatComunService,
    private equipoGerencialService: EquipoGerencialService,
    public modal: ModalService,
    public objetivoService: ObjetivoService,
    public estrategiaObjetivoService: EstrategiaObjetivoService,
    public procesoService: ProcesoService,
    private unidadesSiipneService: UnidadesSiipneService,
    private actividadesService: ActividadesService,

  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.nameArea = localStorage.getItem('nameUnidad'); //
    this.currentAmbiente = JSON.parse(this.buffer);
    this.nombreUnidad = this.currentAmbiente.nombreUnidad;
    this.currentUser = JSON.parse(this.buffer);
    this.idSprAmbiente = this.currentUser.idSprAmbiente;
    this.selectItems = [
      { value: '', label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
  }

  get ambFrm() {
    return this.formAmbiente.controls;
  }



  ngOnInit(): void {
    this.listObjetivo();
    this.listObjetivos();
    this.getIpPublic();
    this.initApp();
  }

  initApp() {

    this.setDataTable();
    this.setForm();
    this.getDataLineaAccion();
    this.listProceso();
    //this.getDataEstrategia();
    this.getDataArea();
    this.getDataEquipoGerencial();
    this.getDataCatalogosTipoParticipante();
    this.getTreeUnidadesSiipne();
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

  setForm() {
    this.formLineaAccion = this.fb.group({
      idSprLineaAccion: [],
      //idSprObjetivo: ['', [Validators.required]],
      idSprEstrategia: ['', [Validators.required]],
      idSprArea: [],
      idSprAreaElemento: [],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      justificacion: ['', [Validators.required]],
      alcance: ['', [Validators.required]],
      //localidadImpacto: ['', [Validators.required]],
      idSprProceso: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      idSprEquipoGerencial: [{}],
      /*******************set localidad de impacto *********************************/
      localidadImpacto: ['', [Validators.required]],//para la localidad de impacto
      idDgpUnidad: ['', [Validators.required]],//para la localidad de impacto
      /********************* Fin set localidad de impacto ***************************/
      /*************************set participantes *********************************/
      cedula: ['', [Validators.required]],
      grado: ['', [Validators.required]],
      nombreParticipante: ['', [Validators.required]],
      fechaInicioParticipante: ['', [Validators.required]],
      fechaFinParticipante: ['', []],
      estadoParticipa: ['', []],
      /*************************Fin set participantes *********************************/

    });
    this.formLineaAccion.patchValue({
      estado: this.selectItems[0].value,
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

  //////////////////////////Para el árbol de unidades //////////////////////////


  getTreeUnidadesSiipne() {
    this.unidadesSiipneService.listParents().subscribe((resp: TreeNode[]) => {
      this.unidades = resp;
      this.unidades.forEach(node => {
        this.unidadesSiipneService.listChilds(node.data).subscribe((respChild: TreeNode[]) => {
          node.children = respChild;
        });
      });
    });
  }

  nodeSelect(evt) {
    this.nombreRuta = (this.nombreRuta) + (" / " + evt.node.label),
      this.formLineaAccion.patchValue({
        idDgpUnidad: evt.node.data,
        localidadImpacto: this.nombreRuta
      });
  }

  nodeExpand(event) {
    if (event.node) {
      this.unidadesSiipneService.listChilds(event.node.data).subscribe(resp => {
        event.node.children = resp;
      });
    }
  }

  //////////////////////////FIN árbol de unidades //////////////////////////

  modalElemDetalles(obj: LineaAccionInterface) {
    this.modal.open(this.modalEle);
    this.modalPlanAccion = obj;
    this.formLineaAccion.patchValue({
      idSprLineaAccion: obj.idSprLineaAccion,
    });
    this.idLineaAccion = obj.idSprLineaAccion;
  }

  createPlanAccion(areaAnteriores: any[], areaElementoGuardado: any[], areaElementosOriginales: any[], patrocinadorOriginal: any) {

    this.formLineaAccion.get("grado").clearValidators()
    this.formLineaAccion.get("grado").updateValueAndValidity()

    this.formLineaAccion.get("nombreParticipante").clearValidators()
    this.formLineaAccion.get("nombreParticipante").updateValueAndValidity()

    this.formLineaAccion.get("cedula").clearValidators()
    this.formLineaAccion.get("cedula").updateValueAndValidity()

    this.formLineaAccion.get("fechaInicioParticipante").clearValidators()
    this.formLineaAccion.get("fechaInicioParticipante").updateValueAndValidity()

    this.formLineaAccion.get("fechaFinParticipante").clearValidators()
    this.formLineaAccion.get("fechaFinParticipante").updateValueAndValidity()

    this.formLineaAccion.get("estadoParticipa").clearValidators()
    this.formLineaAccion.get("estadoParticipa").updateValueAndValidity()

    this.formLineaAccion.value.idSprAmbiente = this.currentUser.idSprAmbiente;
    this.formLineaAccion.value.usuario = this.currentUser.idSprUsuario;
    this.formLineaAccion.value.ip = this.ipAddress;
    this.submitted = true;
    let fechaInicial = this.formLineaAccion.value.fechaInicio;
    let fechaFinal = this.formLineaAccion.value.fechaFin;

    if (fechaInicial > fechaFinal) {
      this.alertService.error(
        'ERROR',
        'La fecha inicial no puede ser mayor a la fecha final'
      );
    }
    console.log("formLineaAccion", this.formLineaAccion.invalid)
    if (this.formLineaAccion.invalid && fechaInicial < fechaFinal) {
      //Realizar el posteo
      let lineaAccion = {
        idSprAmbiente: this.currentUser.idSprAmbiente,
        usuario: this.currentUser.idSprUsuario,
        ip: this.ipAddress,
        fecha: new Date(),
        idSprEstrategia: this.formLineaAccion.value.idSprEstrategia,
        idSprLineaAccion: this.formLineaAccion.value.idSprLineaAccion,
        nombre: this.formLineaAccion.value.nombre,
        descripcion: this.formLineaAccion.value.descripcion,
        fechaInicio: this.formLineaAccion.value.fechaInicio,
        fechaFin: this.formLineaAccion.value.fechaFin,
        justificacion: this.formLineaAccion.value.justificacion,
        alcance: this.formLineaAccion.value.alcance,
        localidadImpacto: this.formLineaAccion.value.localidadImpacto,
        idSprProceso: this.formLineaAccion.value.idSprProceso,
        estado: this.formLineaAccion.value.estado,
      };

      let patrocinador = {
        idSprEquipoGerencial: this.guardarEquipoGerencialSeleccionado.idSprEquipoGerencial,
        idSprLineaAccion: this.formLineaAccion.value.idSprLineaAccion,
        fechaInicio: this.formLineaAccion.value.fechaInicio,
        fechaFin: this.formLineaAccion.value.fechaFin,
        estado: this.formLineaAccion.value.estado,
        ip: this.ipAddress,
        usuario: this.currentUser.idSprUsuario,
      };
      console.log("idSprLineaAccion", this.formLineaAccion.value.idSprLineaAccion)
      if (this.formLineaAccion.value.idSprLineaAccion === null) {
        this.formLineaAccion.value.fechaInicio = fechaInicial;
        this.formLineaAccion.value.fechaFin = fechaFinal;
        this.lineaAccionService.create(lineaAccion)
          .pipe(
            mergeMap((planAccionGuardado) => {
              this.crearParticipantes(planAccionGuardado.idSprLineaAccion);
              let suscribciones = [];

              this.selecAreas.forEach((area) => {
                let areasPlanAccion = {
                  idSprAmbiente: this.currentUser.idSprAmbiente,
                  usuario: this.currentUser.idSprUsuario,
                  ip: this.ipAddress,
                  fecha: new Date(),
                  idSprArea: area,
                  idSprAreaElemento: this.formLineaAccion.value.idSprAreaElemento,
                  idSprProyecto: this.formLineaAccion.value.idSprProyecto,
                  idSprLineaAccion: planAccionGuardado.idSprLineaAccion,
                  //idSprProceso: this.formLineaAccion.value.idSprProceso,
                  estado: this.formLineaAccion.value.estado,
                };
                areasPlanAccion.idSprLineaAccion = planAccionGuardado.idSprLineaAccion;
                suscribciones.push(
                  this.areaElementosService.create(areasPlanAccion)
                );
              });
              lineaAccion.idSprLineaAccion = planAccionGuardado.idSprLineaAccion;
              patrocinador.idSprLineaAccion = planAccionGuardado.idSprLineaAccion;
              this.participanteElementoService.create(patrocinador).subscribe(

              )
              return forkJoin(suscribciones);
            })
          )
          .subscribe(
            (data) => {
              this.listObjetivos();
              this.initApp();
              this.getDataLineaAccion();
              // this.getDataEstrategia();
              this.getDataArea();
              this.selecAreas = [];
              this.closeModal();
              this.alertService.createOk();
            },
            (err) => {
              this.alertService.createError();
              this.lineaAccionService.delete(lineaAccion).subscribe();
              this.closeModal();
            }
          );


      } else {
        console.log("ingeso al else")
        let areasTrue = []
        let areasFalse = []

        areasTrue = areaElementoGuardado.filter((area: any) => {
          return area.checked === true
        })

        areasFalse = areaElementoGuardado.filter((area: any) => {
          return area.checked === false
        })

        let areasElementoAeliminar = areaElementosOriginales.filter((area: any) => {
          return areasFalse.some(a => a.idSprArea === area.idSprArea)
        })

        let areasElementoAnadir = areasTrue.filter((area: any) => {
          return areaElementosOriginales.every(a => a.idSprArea !== area.idSprArea)

        })

        let uniqueArray = areasElementoAnadir.
          filter((obj, index, self) =>

            index === self.findIndex((item) => item.idSprArea === obj.idSprArea)
          );

        areasElementoAeliminar.forEach((areaElementoQuitar) => {
          this.areaElementosService.delete(areaElementoQuitar).subscribe()
        })
        uniqueArray.forEach((area) => {
          let areasPlanAccion = {
            idSprAmbiente: this.currentUser.idSprAmbiente,
            usuario: this.currentUser.idSprUsuario,
            ip: this.ipAddress,
            idSprArea: area.idSprArea,
            idSprAreaElemento: this.formLineaAccion.value.idSprAreaElemento,
            idSprProyecto: this.formLineaAccion.value.idSprProyecto,
            idSprLineaAccion: this.formLineaAccion.value.idSprLineaAccion,
            idSprProceso: this.formLineaAccion.value.idSprProceso,
            estado: this.formLineaAccion.value.estado,
          };
          areasPlanAccion.idSprLineaAccion = this.formLineaAccion.value.idSprLineaAccion;
          this.areaElementosService.create(areasPlanAccion).subscribe()
        });

        this.participanteElementoAeliminar.forEach(participante => {
          this.participanteElementoService.delete(participante).subscribe()
        })

        this.participanteElementoAeliminar.forEach(participante => {
          console.log("actualiza",participante);
          this.equipoGerencialService.actualizaEquipo(participante).subscribe()
        })





        this.crearParticipantes(this.formLineaAccion.value.idSprLineaAccion)
        this.lineaAccionService.update(lineaAccion)
          .subscribe(data => {
            this.listObjetivos();
            this.initApp();
            //this.getDataLineaAccion();
            //this.getDataEstrategia();
            //this.getDataArea();
            this.closeModal();
            this.alertService.createOk();
          }, (err) => {
            this.alertService.createError();
            this.lineaAccionService.delete(lineaAccion).subscribe();

            this.closeModal();
          });
      }
    } else {
      return;
    }
  }


  crearParticipantes(idSprLineaAccion: number) {
    this.participantesNuevos.forEach(participante => {
      let equipoGerencial = {
        idSprAmbiente: this.currentUser.idSprAmbiente,
        idSprTipoParticipante: this.idSprTipoParticipante,
        cedula: participante.cedula,
        gradoNombres: `${participante.grado}. ${participante.nombre}`,
        fechaInicio: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
        fechaFin: null,
        estado: participante.estadoParticipa,
        ip: this.ipAddress,
        usuario: this.currentUser.idSprUsuario,
      }
      this.equipoGerencialService.create(equipoGerencial).subscribe({
        next: equipoGerencialCreado => {
          let participanteElemento = {
            idSprLineaAccion: idSprLineaAccion,
            fechaInicio: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
            fechaFin: null,
            estado: participante.estadoParticipa,
            ip: this.ipAddress,
            usuario: this.currentUser.idSprUsuario,
            idSprEquipoGerencial: equipoGerencialCreado.idSprEquipoGerencial,
          }
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
    if (this.formLineaAccion.controls["nombreParticipante"].invalid ||
      this.formLineaAccion.controls["grado"].invalid ||
      this.formLineaAccion.controls["cedula"].invalid ||
      this.formLineaAccion.controls["estadoParticipa"].invalid ||
      this.formLineaAccion.controls["fechaFinParticipante"].invalid
    ) {
      this.alertService.createError();
      return
    }
    this.participantesNuevos.push({
      nombre: this.formLineaAccion.value.nombreParticipante,
      grado: this.formLineaAccion.value.grado,
      cedula: this.formLineaAccion.value.cedula,
      fechaInicial: this.pipe.transform(this.hoy, 'YYYY-MM-dd'),
      fechaFinal: this.formLineaAccion.value.fechaFinParticipante,
      estadoParticipa: 1,
    });
    this.formLineaAccion.controls["nombreParticipante"].reset()
    this.formLineaAccion.controls["grado"].reset()
    this.formLineaAccion.controls["cedula"].reset()
    this.formLineaAccion.controls["fechaInicioParticipante"].reset()
    this.formLineaAccion.controls["fechaFinParticipante"].reset()
    this.formLineaAccion.controls["estadoParticipa"].reset()
  }


  getDataCatalogosTipoParticipante() {
    this.catComunService.list("?spr_idSprComun=" + this.spr_idSprComun)
      .subscribe(lista => { this.listaTipoParticipante = lista })
  }

  getDataParticipanteElemento(idSprLineaAccion: number) {
    this.participanteElementoService.list('?idSprLineaAccion=' + idSprLineaAccion)
      .subscribe((res: any) => {
        this.participanteElemento = res
        console.log("participanteElemento", this.participanteElemento)
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
              this.formLineaAccion.patchValue({
                ...this.formLineaAccion.value,
                idSprEquipoGerencial: resi.idSprEquipoGerencial
              })
              this.formLineaAccion.value.idSprEquipoGerencial = resi.idSprEquipoGerencial
              console.log("this.formLineaAccion.value.idSprEquipoGerencial", this.formLineaAccion.value.idSprEquipoGerencial)
            }
          })
        })
      })
  }


  updateLineaAccion(obj: any, listaAreas: any[]) {
    this.areaElementoGuardado = [];
    this.modal.open(this.nameModal);
    this.getDataParticipanteElemento(obj.idSprLineaAccion)
    this.areaElementosService.list('?idSprLineaAccion=' + obj.idSprLineaAccion)
      .subscribe((res) => {
        this.areaElementosOriginales = res
        listaAreas.forEach((area) => {
          let areaArmada = {
            idSprArea: area.idSprArea,
            checked: false,
            nombre: area.nombre,
          };
          res.forEach((areaElemento) => {
            if (areaElemento.idSprArea === area.idSprArea) {
              areaArmada.checked = true;
            }
          });
          this.areaElementoGuardado.push(areaArmada)
          this.areaAnteriores.push(areaArmada)
        });
      });
    console.log("formLineaAccion", obj.descripcion)
    this.formLineaAccion.patchValue({
      idSprLineaAccion: obj.idSprLineaAccion,
      idSprEstrategia: obj.idSprEstrategia,
      //idSprArea: obj.area.idSprArea,
      //idSprEquipoGerencial: obj.idSprEquipoGerencial,
      nombre: obj.nombrelineaAccion,
      descripcion: obj.descripcion,
      fechaInicio: obj.fechaInicio,
      fechaFin: obj.fechaFin,
      justificacion: obj.justificacion,
      alcance: obj.alcance,
      localidadImpacto: obj.localidadImpacto,
      idSprProceso: obj.idSprProceso,
      estado: obj.estado,
      idSprAreaElemento: obj.idSprAreaElemento,
    });
  }

  elementos(obj: LineaAccionInterface) {
    this.modal.open('modalElementos');
    this.formLineaAccion.patchValue({
      idSprLineaAccion: obj.idSprLineaAccion,
    });
    this.idLineaAccion = obj.idSprLineaAccion;
  }



  setEquipoGenrecial(obj: any, dataEquipoGerencial: any) {
    this.guardarEquipoGerencialSeleccionado =
      dataEquipoGerencial.filter(equipo => {
        return equipo.idSprEquipoGerencial === +obj.value
      })[0]
  }


  fieldsChange(values: any, id: number): void {
    if (values.currentTarget.checked) {
      this.selecAreas.push(id);
    } else {
      this.selecAreas = this.selecAreas.filter(function (item) {
        return item !== id;
      });
    }
  }

  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getDataLineaAccion() {
    forkJoin(
      this.lineaAccionService.list(),
      this.areaService.list(),
      this.areaElementosService.list()
    ).subscribe((res) => {
      let lineasAccion = res[0];
      let areas = res[1];
      let areasElementos = res[2];
      this.dataLineaAccion = [];

      lineasAccion.forEach((plan: any) => {
        let areaElementoEncontrado = areasElementos!.filter(
          (areaElemento: any) => {
            return areaElemento.idSprLineaAccion === plan.idSprLineaAccion;
          }
        );
        let planMapeado = {
          ...plan,
          idSprAreaElemento: areaElementoEncontrado[0]?.idSprAreaElemento,
          area: areaElementoEncontrado[0] ? areas.filter((area: any) => {
            return area.idSprArea === areaElementoEncontrado[0].idSprArea;
          })[0]
            : areas[0],
        };
        this.dataLineaAccion.push(planMapeado);
      });
      //this.reDrawDataTable();
    });
  }
  /*************************mapeo lienas de accion***********************/
  listObjetivos() {
    this.objetivoService.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
      this.dataObjetivoL = resp;
      console.log('ProcesosL: ', this.dataObjetivoL);
      this.getDataEstrategiasObjetivos();
    });
  }

  getDataEstrategiasObjetivos() {
    this.estrategiaObjetivoService.list().subscribe((resp) => {
      this.dataEstrategiaObjetivoL = resp;
      this.getEstrategia();
    });
  }
  getEstrategia() {
    this.estrategiaService.list()
      .subscribe((resp) => {
        this.dataEstrategiaL = resp;
        this.getLineaAccion();
      });
  }

  getLineaAccion() {
    this.lineaAccionService.list().subscribe((resp) => {
      this.dataLineaAccionL = resp;
      this.getParticipanteElemento();
    });
  }

  getParticipanteElemento() {
    this.participanteElementoService.list().subscribe((resp) => {
      this.dataPersonalElementoL = resp;
      console.log('dataPersonalElementoL: ', this.dataPersonalElementoL);
      this.getEquipoGerencial();
    })
    console.log("ingreso")
  }

  getEquipoGerencial() {
    this.equipoGerencialService.list().subscribe((resp) => {
      this.dataEquipoGerencialL = resp;
      console.log('dataEquipoGerencialL: ', this.dataEquipoGerencialL);
      this.mapeoLineaAccion()
    })

    /*this.equipoGerencialService.list('?idSprAmbiente=' + this.idSprAmbiente )
      .subscribe((resp) => {
        this.dataEquipoGerencial = resp;
        console.log('dataEquipoGerencialL: ', this.dataEquipoGerencialL);
      this.mapeoLineaAccion()
      });*/
  }
  mapeoLineaAccion() {
    let lineaAccionMap: any = [];
    let equipoLineMap: any = [];
    let indiceUno = 0;
    let dataRiesgoLineaMap: any = [];

    for (let i = 0; i < this.dataObjetivoL.length; i++) {
      for (let j = 0; j < this.dataEstrategiaObjetivoL.length; j++) {
        if ((this.dataObjetivoL[i].idSprObjetivo == this.dataEstrategiaObjetivoL[j].idSprObjetivo) && (this.dataEstrategiaObjetivoL[j].nivelSuperior == 'N')) {
          console.log("ingreso")
          for (let k = 0; k < this.dataEstrategiaL.length; k++) {
            if (this.dataEstrategiaL[k].idSprEstrategia == this.dataEstrategiaObjetivoL[j].idSprEstrategia) {
              for (let l = 0; l < this.dataLineaAccionL.length; l++) {
                if ((this.dataLineaAccionL[l].idSprEstrategia == this.dataEstrategiaL[k].idSprEstrategia)) {
                  console.log("ingreso")

                  for (let w = 0; w < this.dataPersonalElementoL.length; w++) {
                    if (this.dataPersonalElementoL[w].idSprLineaAccion == this.dataLineaAccionL[l].idSprLineaAccion) {
                      for (let x = 0; x < this.dataEquipoGerencialL.length; x++) {
                        if (this.dataEquipoGerencialL[x].idSprEquipoGerencial == this.dataPersonalElementoL[w].idSprEquipoGerencial) {
                          equipoLineMap.push({

                            idSprEquipoGerencial: this.dataEquipoGerencialL[x].idSprEquipoGerencial,
                            gradoNombres: this.dataEquipoGerencialL[x].gradoNombres,

                          });
                        }
                      }
                    }
                  }
                  lineaAccionMap.push({
                    idSprEstrategia: this.dataEstrategiaL[k].idSprEstrategia,
                    nombreEstrategia: this.dataEstrategiaL[k].nombre,
                    idSprLineaAccion: this.dataLineaAccionL[l].idSprLineaAccion,
                    nombrelineaAccion: this.dataLineaAccionL[l].nombre,
                    descripcion: this.dataLineaAccionL[l].descripcion,
                    justificacion: this.dataLineaAccionL[l].justificacion,
                    alcance: this.dataLineaAccionL[l].alcance,
                    idSprProceso: this.dataLineaAccionL[l].idSprProceso,
                    fechaInicio: this.dataLineaAccionL[l].fechaInicio,
                    fechaFin: this.dataLineaAccionL[l].fechaFin,
                    estado: this.dataLineaAccionL[l].estado,
                    localidadImpacto: this.dataLineaAccionL[l].localidadImpacto,
                  });
                }
              }
            }
          }
        }
      }
    }
    console.log("lineaAccionMap", lineaAccionMap)
    this.dataLineaAccionEquipo = lineaAccionMap
  }


  /*************************fin mapeo lienas de accion***********************/

  /****************** mapeo de objetivos-estrategia **************************/
  listObjetivo() {
    this.objetivoService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataObjetivo = resp;
        this.listEstrategiaObjetivo();
      });
  }

  listEstrategiaObjetivo() {
    this.estrategiaObjetivoService.list()
      .subscribe(resp => {
        this.dataEstrategiaObjetivo = resp;
        this.getDataEstrategia();
      });
  }

  getDataEstrategia() {
    this.estrategiaService.list()
      .subscribe((resp) => {
        this.dataEstrategia = resp;
        this.mapeoObjetivoLinea();
      });
  }

  mapeoObjetivoLinea() {
    let dataEstrategiass: any = [];
    for (let i = 0; i < this.dataObjetivo.length; i++) {
      for (let j = 0; j < this.dataEstrategiaObjetivo.length; j++) {
        if (this.dataObjetivo[i].idSprObjetivo == this.dataEstrategiaObjetivo[j].idSprObjetivo) {
          for (let k = 0; k < this.dataEstrategia.length; k++) {
            if ((this.dataEstrategia[k].idSprEstrategia == this.dataEstrategiaObjetivo[j].idSprEstrategia) && (this.dataEstrategiaObjetivo[j].nivelSuperior == 'N')) {
              dataEstrategiass.push({
                idSprObjetivo: this.dataObjetivo[i].idSprObjetivo,
                idSprEstrategiaObjetivo: this.dataEstrategiaObjetivo[j].idSprEstrategiaObjetivo,
                idSprEstrategia: this.dataEstrategia[k].idSprEstrategia,
                nombre: this.dataEstrategia[k].nombre,
                descripcion: this.dataEstrategia[k].descripcion,
                estado: this.dataObjetivo[i].estado,
              });
            }
          }
        }
      }
    }
    this.dataEstrategiaMap = dataEstrategiass;
  }
  filtrarEstrategias(estrategias: any[], lineasAccion: any[]) {
    return lineasAccion.filter(plan => {
      return estrategias.some(obj => obj.idSprEstrategia === plan.idSprEstrategia)
    })
  }
  /****************** fin mapeo de objetivos-estrategia **************************/

  listProceso() { //trae data de los procesos
    this.procesoService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataProceso = resp;
      });
  }


  getDataArea() {
    this.areaService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe((resp) => {
        this.dataArea = resp;
      });
  }

  getDataEquipoGerencial() {
    this.equipoGerencialService.list('?idSprAmbiente=' + this.idSprAmbiente + '&idSprTipoParticipante=' + this.idSprTipoParticipante1)
      .subscribe((resp) => {
        this.dataEquipoGerencial = resp;
      });
  }

  deletePlanAcccion(idRegister: number) {
    this.modal.open('deleteLineAccion');
    this.idDeleteRegister = idRegister;
  }

  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.actividadesService.list(`?idSprLineaAccion=${this.idDeleteRegister}&delLog=N`)
        .subscribe(response => {
          if (response.length < 1) {

            if (this.idDeleteRegister > 0) {
              this.areaElementosService.list('?idSprLineaAccion=' + this.idDeleteRegister).subscribe(
                res => {
                  res.forEach(areaElemento => {
                    this.areaElementosService.delete(areaElemento).subscribe()
                  })
                }
              )
              this.participanteElementoService.list("?idSprLineaAccion=" + this.idDeleteRegister).subscribe(
                res => {
                  res.forEach(parcipanteElemento => {
                    this.participanteElementoService.delete(parcipanteElemento).subscribe()
                  })
                }
              )
              this.lineaAccionService.delete({
                idSprLineaAccion: this.idDeleteRegister,
                usuario: this.currentUser.idSprUsuario,
                delLog: 'S',
                ip: this.ipAddress,
              })
                .subscribe(
                  (resp) => {
                    //this.reDrawDataTable()
                    this.listObjetivo();
                    this.initApp();
                    this.getDataLineaAccion();
                    this.alertService.deleteOk();
                    this.modal.close();
                  },
                  (err) => {
                    this.alertService.deleteError();
                  }
                );
            }

          } else {
            this.alertService.warning("Atención", "No se puede borrar este registro, EXISTE ACTIVIDADES RELACIONADAS!")
            this.modal.close();
          }
        });
    } else {
      this.alertService.warning("Atención", "Ocurrió un error al intentar borrar el registro");
      this.modal.close();
    }
  }

  getNombreEstrategia(id: number, estrategias: Estrategias[]) {
    return estrategias?.filter((estrategia) => {
      return estrategia.idSprEstrategia === id;
    });
  }

  getNombreArea(id: number, areas: Area[]) {
    return areas.filter((area) => {
      return area.idSprArea === id;
    });
  }

  openModal() {
    this.edit = false;
    this.onResetForm();
    this.modal.open(this.nameModal);
    this.inputsAnteriores = [];
  }

  onResetForm() {
    this.submitted = false;
    this.formLineaAccion.reset();
  }

  closeModalElementos() {
    return (this.modalElementos = false);
  }

  closeModal() {
    this.modal.close();
  }

  closeModal2() {
    this.modal.closeId('modalEliminar');
  }

  // modal add participantes

  openModalParticipantes() {
    this.modalOpen = true;
  }

  closeModalParticipantes() {
    this.modalOpen = false;
  }

  removeInput(index: number) {
    this.participantesNuevos.splice(index, 1);
  }


  removeInputAnteriores(index: number, obj: any) {
    this.participanteElementoAeliminar.push(obj.participanteElemento)
    this.inputsAnteriores.splice(index, 1);
  }
}
