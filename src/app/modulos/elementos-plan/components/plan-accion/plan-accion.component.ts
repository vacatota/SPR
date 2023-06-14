import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
import { ProcesoService } from '../../services/proceso.service';
import { TreeNode } from 'primeng/api';
import { UnidadesSiipneService } from 'src/app/services/unidades-siipne.service';
import { ActividadesService } from '../../services/actividades.service';

@Component({
  selector: 'app-plan-accion',
  templateUrl: './plan-accion.component.html',
  styleUrls: ['./plan-accion.component.css'],
})
export class PlanAccionComponent {
  public mostrarModal: boolean = false;
  public dataPlanAccion: any = [];
  public listaTipoParticipante: any = [];
  public participanteElemento: any = [];
  public dataObjetivo!: any;
  public dataArea!: any;
  public dataEquipoGerencial!: any;
  public dataAreaElementos!: any;
  public formSubmitted = false;
  public formPlanAccion!: FormGroup;
  public formParticipantes!: FormGroup;
  public patrocinadorOriginal: any;
  public nombreRuta: any = '';
  public idPatrocinador: number=274;
  public idParticipante: number=293;

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
  namePlanes = 'PLANES DE ACCIÓN';
  nameDetalles = 'DETALLE PLANES DE ACCIÓN';
  public idPlanAccion: any;
  public modalPlanAccion: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  private idDeleteRegister: number = 0;
  public nameModal: string = 'modalPlanAccion';
  public modalEle: string = 'modalEle';
  modalOpen = false;
  participantesNuevos = [];
  areaElementoGuardado = [];
  edit: boolean = false;
  areaAnteriores = [];
  areaElementosOriginales = [];
  public guardarEquipoGerencialSeleccionado: any;
  inputsAnteriores = [];
  public participanteElementoAeliminar = [];
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
    "POL."];

  public dataProceso!: any;
  unidades: TreeNode[];
  selectedFile: TreeNode;

  constructor(
    private fb: FormBuilder,
    private planAccionService: PlanAccionService,
    private ip: IpPublicService,
    private objetivoService: ObjetivoService,
    private alertService: AlertService,
    private areaElementosService: AreaElementoService,
    private participanteElementoService: ParticipanteElementoService,
    private areaService: AreaService,
    private catComunService: CatComunService,
    private equipoGerencialService: EquipoGerencialService,
    public modal: ModalService,
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



  ngOnInit(): void {
    this.getIpPublic();
    this.initApp();
  }

  initApp() {
    this.setDataTable();
    this.setForm();
    this.getDataPlanesAccionN5();
    this.getDataObjetivo();
    this.getDataArea();
    this.getDataEquipoGerencial();
    this.getDataCatalogosTipoParticipante();
    this.listProceso();
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
    this.formPlanAccion = this.fb.group({
      idSprPlanAccion: [],
      idSprObjetivo: ['', [Validators.required]],
      idSprArea: [],
      idSprAreaElemento: [],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      justificacion: ['', [Validators.required]],
      alcance: ['', [Validators.required]],
      localidadImpacto: ['', [Validators.required]],
      impactoProceso: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      idSprEquipoGerencial: [{}],


      cedula: ['', [Validators.required]],
      grado: ['', [Validators.required]],
      nombreParticipante: ['', [Validators.required]],
      fechaInicioParticipante:['', []],
      fechaFinParticipante: ['', []],
      estadoParticipa: ['', []],
    });





    this.formPlanAccion.patchValue({
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

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); // Obtener el día con dos dígitos
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtener el mes con dos dígitos (los meses empiezan desde 0)
    const year = date.getFullYear().toString(); // Obtener el año con cuatro dígitos
  
    return `${year}-${month}-${day}`;
  }
  
  modalElemDetalles(obj: planesAccionInterface) {
    this.modal.open(this.modalEle);
    this.modalPlanAccion = obj;
    this.formPlanAccion.patchValue({
      idSprPlanAccion: obj.idSprPlanAccion,
    });
    this.idPlanAccion = obj.idSprPlanAccion;
  }

  listProceso() { ///trae data de los procesos
    this.procesoService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataProceso = resp;
      });
  }


  createPlanAccion(areaAnteriores: any[], areaElementoGuardado: any[], areaElementosOriginales: any[], patrocinadorOriginal: any) {
    this.formPlanAccion.get("grado").clearValidators()
    this.formPlanAccion.get("grado").updateValueAndValidity()
    this.formPlanAccion.get("nombreParticipante").clearValidators()
    this.formPlanAccion.get("nombreParticipante").updateValueAndValidity()
    this.formPlanAccion.get("cedula").clearValidators()
    this.formPlanAccion.get("cedula").updateValueAndValidity()
    this.formPlanAccion.get("fechaInicioParticipante").clearValidators()
    this.formPlanAccion.get("fechaInicioParticipante").updateValueAndValidity()
    this.formPlanAccion.get("fechaFinParticipante").clearValidators()
    this.formPlanAccion.get("fechaFinParticipante").updateValueAndValidity()
    this.formPlanAccion.get("estadoParticipa").clearValidators()
    this.formPlanAccion.get("estadoParticipa").updateValueAndValidity()

    this.formPlanAccion.value.idSprAmbiente = this.currentUser.idSprAmbiente;
    this.formPlanAccion.value.usuario = this.currentUser.idSprUsuario;
    this.formPlanAccion.value.ip = this.ipAddress;
    this.formSubmitted = true;
    let fechaInicial = this.formPlanAccion.value.fechaInicio;
    let fechaFinal = this.formPlanAccion.value.fechaFin;

    if (fechaInicial > fechaFinal) {
      this.alertService.error(
        'ERROR',
        'La fecha inicial no puede ser mayor a la fecha final'
      );
    }
    console.log("formLineaAccion",this.formPlanAccion.invalid)
    if (!this.formPlanAccion.invalid && fechaInicial < fechaFinal) {


      //Realizar el posteo
      let planAccion = {
        idSprAmbiente: this.currentUser.idSprAmbiente,
        usuario: this.currentUser.idSprUsuario,
        ip: this.ipAddress,
        fecha:new Date(),
        idSprObjetivo: this.formPlanAccion.value.idSprObjetivo,
        idSprPlanAccion: this.formPlanAccion.value.idSprPlanAccion,
        nombre: this.formPlanAccion.value.nombre,
        descripcion: this.formPlanAccion.value.descripcion,
        fechaInicio: this.formPlanAccion.value.fechaInicio,
        fechaFin: this.formPlanAccion.value.fechaFin,
        justificacion: this.formPlanAccion.value.justificacion,
        alcance: this.formPlanAccion.value.alcance,
        localidadImpacto: this.formPlanAccion.value.localidadImpacto,
        impactoProceso: this.formPlanAccion.value.impactoProceso,
        estado: this.formPlanAccion.value.estado,
      };



      let patrocinador = {

        idSprEquipoGerencial: this.guardarEquipoGerencialSeleccionado.idSprEquipoGerencial,
        idSprPlanAccion: this.formPlanAccion.value.idSprPlanAccion,


        fechaInicio: this.formPlanAccion.value.fechaInicio,
        fechaFin: null,
        estado: this.formPlanAccion.value.estado,
        ip: this.ipAddress,
        fecha:  new Date(),
        usuario: this.currentUser.idSprUsuario,

      };
      console.log("idSprLineaAccion",this.formPlanAccion.value.idSprPlanAccion)

      if (this.formPlanAccion.value.idSprPlanAccion === null) {
        this.formPlanAccion.value.fechaInicio = fechaInicial;
        this.formPlanAccion.value.fechaFin = fechaFinal;



        this.planAccionService
          .createPlanesAccion(planAccion)
          .pipe(
            mergeMap((planAccionGuardado) => {
              this.crearParticipantes(planAccionGuardado.idSprPlanAccion);
              let suscribciones = [];

              this.selecAreas.forEach((area) => {
                let areasPlanAccion = {
                  idSprAmbiente: this.currentUser.idSprAmbiente,
                  usuario: this.currentUser.idSprUsuario,
                  ip: this.ipAddress,
                  fecha: new Date(),
                  idSprArea: area,
                  idSprAreaElemento:
                    this.formPlanAccion.value.idSprAreaElemento,
                  idSprProyecto: this.formPlanAccion.value.idSprProyecto,
                  idSprPlanAccion: planAccionGuardado.idSprPlanAccion,
                  idSprProceso: this.formPlanAccion.value.idSprProceso,
                  estado: this.formPlanAccion.value.estado,
                };
                areasPlanAccion.idSprPlanAccion = planAccionGuardado.idSprPlanAccion;
                suscribciones.push(
                  this.areaElementosService.create(areasPlanAccion)
                );
              });
              planAccion.idSprPlanAccion = planAccionGuardado.idSprPlanAccion;
              patrocinador.idSprPlanAccion = planAccionGuardado.idSprPlanAccion;
              this.participanteElementoService.create(patrocinador).subscribe(

              )
              return forkJoin(suscribciones);
            })
          )
          .subscribe(
            (data) => {
              this.getDataPlanesAccionN5();
              this.getDataObjetivo();
              this.getDataArea();
              this.selecAreas = [];
              this.closeModal();
              this.alertService.createOk();
            },
            (err) => {
              this.alertService.createError();
              this.planAccionService.delete(planAccion).subscribe();
              this.closeModal();
            }
          );


      } else {

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
            fecha: new Date(),
            idSprArea: area.idSprArea,
            idSprAreaElemento:
              this.formPlanAccion.value.idSprAreaElemento,
            idSprProyecto: this.formPlanAccion.value.idSprProyecto,
            idSprPlanAccion: this.formPlanAccion.value.idSprPlanAccion,
            idSprProceso: this.formPlanAccion.value.idSprProceso,
            estado: this.formPlanAccion.value.estado,
          };
          areasPlanAccion.idSprPlanAccion = this.formPlanAccion.value.idSprPlanAccion;
          this.areaElementosService.create(areasPlanAccion).subscribe()


        });
        if (this.guardarEquipoGerencialSeleccionado.idSprEquipoGerencial !== patrocinadorOriginal.idSprEquipoGerencial) {
          this.participanteElementoService.delete(patrocinadorOriginal).subscribe()

          let patrocinador = {

            // idSprEquipoGerencial: this.formPlanAccion.value.idSprEquipoGerencial,

            idSprEquipoGerencial: this.guardarEquipoGerencialSeleccionado.idSprEquipoGerencial,
            idSprPlanAccion: this.formPlanAccion.value.idSprPlanAccion,


            fechaInicio: this.formPlanAccion.value.fechaInicio,
            fechaFin: null,
            estado: this.formPlanAccion.value.estado,
            ip: this.ipAddress,
            fecha:new Date(),
            usuario: this.currentUser.idSprUsuario,

          };
          this.participanteElementoService.create(patrocinador).subscribe()

        }
        this.participanteElementoAeliminar.forEach(participante => {
          this.participanteElementoService.delete(participante).subscribe()

        })

        this.participanteElementoAeliminar.forEach(participante => {
          console.log("actualiza",participante);
          this.equipoGerencialService.actualizaEquipo(participante).subscribe()
        })

        this.crearParticipantes(this.formPlanAccion.value.idSprPlanAccion)
        this.planAccionService.update(planAccion)

          .subscribe(data => {

            this.getDataPlanesAccionN5();
            this.getDataObjetivo();
            this.getDataArea();
            this.closeModal();
            this.alertService.createOk();
          }, (err) => {
            this.alertService.createError();
            this.planAccionService.delete(planAccion).subscribe();

            this.closeModal();
          });

      }


    } else {
      return;
    }
  }



  crearParticipantes(idSprPlanAccion: number) {
    this.participantesNuevos.forEach(participante => {

      let equipoGerencial = {
        idSprAmbiente: this.currentUser.idSprAmbiente,

        idSprTipoParticipante: this.idParticipante,
        cedula: participante.cedula,
        gradoNombres: `${participante.grado} ${participante.nombre}`,
        fechaInicio:  this.formatDate(new Date()),
        fechaFin: null,
        estado: participante.estadoParticipa,
        ip: this.ipAddress,
        usuario: this.currentUser.idSprUsuario,

      }
      this.equipoGerencialService.create(equipoGerencial).subscribe({
        next: equipoGerencialCreado => {
          let participanteElemento = {

            idSprPlanAccion: idSprPlanAccion,
            fechaInicio:  this.formatDate(new Date()),
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




  getDataCatalogosTipoParticipante() {
    this.catComunService.list("?spr_idSprComun=271").subscribe(lista => { this.listaTipoParticipante = lista })

  }

  getDataParticipanteElemento(idSprPlanAccion: number) {
    this.participanteElementoService.list('?idSprPlanAccion=' + idSprPlanAccion).subscribe((res: any) => {
  
      this.participanteElemento = res
      let participanteElementoPatrocinador: any
      this.inputsAnteriores = []
      res.forEach(participante => {

        this.equipoGerencialService.getById(participante.idSprEquipoGerencial).subscribe((resi: any) => {
    
          if (resi.idSprTipoParticipante === this.idParticipante) {

            this.inputsAnteriores.push({ ...resi, participanteElemento: participante })

          }
          else {
          
            this.patrocinadorOriginal = participante
            participanteElementoPatrocinador = resi
            this.guardarEquipoGerencialSeleccionado = resi

            this.formPlanAccion.patchValue({
              ...this.formPlanAccion.value,
              idSprEquipoGerencial: resi.idSprEquipoGerencial
            })
            this.formPlanAccion.value.idSprEquipoGerencial = resi.idSprEquipoGerencial

          }
        })
      })
    })
  }


  updatePlanesAccion(obj: any, listaAreas: any[]) {
    this.edit = true;
    this.areaElementoGuardado = [];
    this.modal.open(this.nameModal);
    this.participantesNuevos = [];
    this.getDataParticipanteElemento(obj.idSprPlanAccion)
    this.areaElementosService
      .list('?idSprPlanAccion=' + obj.idSprPlanAccion)
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
    this.formPlanAccion.patchValue({
      idSprPlanAccion: obj.idSprPlanAccion,
      idSprObjetivo: obj.idSprObjetivo,
      idSprArea: obj.area.idSprArea,
      // idSprEquipoGerencial: obj.idSprEquipoGerencial,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      fechaInicio: obj.fechaInicio,
      fechaFin: obj.fechaFin,
      justificacion: obj.justificacion,

      alcance: obj.alcance,
      localidadImpacto: obj.localidadImpacto,
      impactoProceso: obj.impactoProceso,
      estado: obj.estado,
      idSprAreaElemento: obj.idSprAreaElemento,

    });
  }

  elementos(obj: planesAccionInterface) {
    this.modal.open('modalElementos');
    this.formPlanAccion.patchValue({
      idSprPlanAccion: obj.idSprPlanAccion,
    });
    this.idPlanAccion = obj.idSprPlanAccion;
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

  getDataPlanesAccionN5() {
    forkJoin(
      this.planAccionService.list(),
      this.areaService.list(),
      this.areaElementosService.list()
    ).subscribe((res) => {
      let planesAccion = res[0];
      let areas = res[1];
      let areasElementos = res[2];
      this.dataPlanAccion = [];
      planesAccion.forEach((plan: any) => {
        let areaElementoEncontrado = areasElementos!.filter(
          (areaElemento: any) => {
            return areaElemento.idSprPlanAccion === plan.idSprPlanAccion;
          }
        );
        let planMapeado = {
          ...plan,

          idSprAreaElemento: areaElementoEncontrado[0]?.idSprAreaElemento,
          area: areaElementoEncontrado[0]
            ? areas.filter((area: any) => {
              return area.idSprArea === areaElementoEncontrado[0].idSprArea;
            })[0]
            : areas[0],
        };
        this.dataPlanAccion.push(planMapeado);
      });
      this.reDrawDataTable();
    });
  }

  getDataObjetivo() {
    this.objetivoService
      .list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe((resp) => {
        this.dataObjetivo = resp;

      });
  }

  filtrarObjetivos(objetivos: any[], planesAccion: any[]) {

    return planesAccion.filter(plan => {
      return objetivos.some(obj => obj.idSprObjetivo === plan.idSprObjetivo)
    })
  }

  getDataArea() {
    this.areaService
      .list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe((resp) => {
        this.dataArea = resp;

      });
  }

  getDataEquipoGerencial() {
    this.equipoGerencialService
      .list('?idSprAmbiente=' + this.idSprAmbiente + '&idSprTipoParticipante='+this.idPatrocinador)
      .subscribe((resp) => {
        this.dataEquipoGerencial = resp;

      });
  }




  confirmDelete() {
    if (this.idDeleteRegister > 0) {
     this.actividadesService.list("?idSprPlanAccion="+this.idDeleteRegister).subscribe(
      res=> {
        res.forEach(actividad=>{
          this.actividadesService.statusChange(actividad).subscribe()

          })
        }
      )

      this.areaElementosService.list("?idSprPlanAccion=" + this.idDeleteRegister).subscribe(
        res => {
          res.forEach(areaElemento => {
            this.areaElementosService.delete(areaElemento).subscribe()

          })
        }
      )

      this.participanteElementoService.list("?idSprPlanAccion=" + this.idDeleteRegister).subscribe(
        res => {
          res.forEach(parcipanteElemento => {
            this.participanteElementoService.delete(parcipanteElemento).subscribe()

          })
        }
      )


      this.planAccionService
        .delete({
          idSprPlanAccion: this.idDeleteRegister,
          usuario: this.currentUser.idSprUsuario,
          delLog: 'S',
          ip: this.ipAddress,
        })
        .subscribe(
          (resp) => {
            this.getDataPlanesAccionN5();

            this.alertService.deleteOk();
            this.modal.close();
            this.initApp();
          },
          (err) => {
            this.alertService.deleteError();
          }
        );
    }
  }




  getNombreObjetivo(id: number, objetivos: Objetivo[]) {
    return objetivos?.filter((objetivo) => {
      return objetivo.idSprObjetivo === id;
    });
  }

  getNombreArea(id: number, areas: Area[]) {
    return areas.filter((area) => {
      return area.idSprArea === id;
    });
  }

  deletePlanAcccion(idRegister: number) {
    this.modal.open('delete');
    this.idDeleteRegister = idRegister;
  }

  openModal() {
    this.edit = false;
    this.onResetForm();
    this.modal.open(this.nameModal);
    this.inputsAnteriores = [];
    this.participantesNuevos = [];
  }

  onResetForm() {
    this.formSubmitted = false;
    this.formPlanAccion.reset();
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
    this.formPlanAccion.controls["nombreParticipante"].reset()
    this.formPlanAccion.controls["grado"].reset()
    this.formPlanAccion.controls["cedula"].reset()
  }

  closeModalParticipantes() {
    this.modalOpen = false;
  }

  pushParticipante() {
    if (this.formPlanAccion.controls["nombreParticipante"].invalid ||
      this.formPlanAccion.controls["grado"].invalid ||
      this.formPlanAccion.controls["cedula"].invalid ||
      this.formPlanAccion.controls["estadoParticipa"].invalid ||
      this.formPlanAccion.controls["fechaFinParticipante"].invalid
      
    ) {
      this.alertService.createError();
      return
    }
    this.participantesNuevos.push({
      nombre: this.formPlanAccion.value.nombreParticipante,
      grado: this.formPlanAccion.value.grado,
      cedula: this.formPlanAccion.value.cedula,
      fechaInicial: this.formatDate(new Date()),
      fechaFinal: this.formPlanAccion.value.fechaFinParticipante,
      estadoParticipa:1,
    });
    this.formPlanAccion.controls["nombreParticipante"].reset()
    this.formPlanAccion.controls["grado"].reset()
    this.formPlanAccion.controls["cedula"].reset()
    this.formPlanAccion.controls["fechaFinParticipante"].reset()
    this.formPlanAccion.controls["estadoParticipa"].reset()


  }

  removeInput(index: number) {
    this.participantesNuevos.splice(index, 1);
  }



  removeInputAnteriores(index: number, obj: any) {

    this.participanteElementoAeliminar.push(obj.participanteElemento)
    this.inputsAnteriores.splice(index, 1);
  }
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
    
    this.formPlanAccion.patchValue({
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
}