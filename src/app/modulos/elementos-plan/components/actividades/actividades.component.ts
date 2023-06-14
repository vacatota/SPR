import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ActividadesService } from '../../services/actividades.service';
import { PlanAccionService } from '../../services/plan.accion.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { ActividadesInterface } from '../../models/actividades';
import { Objetivo } from '../../models/objetivo';
import { ModalService } from 'src/app/services/modal.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css'],
})
export class ActividadesComponent {
  public listaActividadesN5: any = []; //para guardar las actividades
  public mostrarModal: boolean = false;
  public dataPlanAccionN5!: any;
  public dataObjetivoN5!: any;
  public formSubmitted = false;
  public formActividadesPlanN5!: FormGroup;
  public ipAddress: any;
  buffer!: any;
  currentUser!: any;
  nameUnidad!: any;
  public idSprAmbiente: any;
  public nombreObjetivo!: any;
  dataSource: any = [];
  public nameModal: string = 'modalActivities';
  dtOptions: DataTables.Settings = {};
  isDtInitialized: boolean = false;
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  private idDeleteRegister: number = 0;
  nameActivadades='ACTIVIDADES PLANES DE ACCIÓN'

  @Input() set planAccionInput(planAccionInput: any) {
    this.dataSource = planAccionInput;
    if (planAccionInput) {
      this.getActividades();
    }
  }

  @Input() set lineaAccionInput(lineaAccionInput: any) {
    this.dataSource = lineaAccionInput;
    if (lineaAccionInput) {
      this.getActividades();
    }
  }
  constructor(
    private actividadesPlanN5Service: ActividadesService,
    private planAccionservice: PlanAccionService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private ip: IpPublicService,
    public modal: ModalService
  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.nameUnidad = localStorage.getItem('nameUnidad');
    this.currentUser = JSON.parse(this.buffer);
    this.getDataPlanesAccionN5();
    this.getDataObjetivo();
  }

  ngOnInit(): void {
    this.getIpPublic();
    this.initApp();
  }

  initApp() {
    //this.listAmbientes();
    this.setDataTable();
    this.setForm();
    this.getDataPlanesAccionN5(); //deben estar en ngOninit
    this.getDataObjetivo();
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

  setForm() {
    this.formActividadesPlanN5 = this.fb.group({
      idSprActividad: [],
      idSprLineaAccion: [],
      idSprPlanAccion: [],
      nombre: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaCumplimiento: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      cumplimiento: ['', [Validators.required]],
      respaldo: ['', [Validators.required]],
      estado: ['', [Validators.required]],
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

  getActividades() {
    console.log('saul', this.dataSource.idSprPlanAccion);
    if (this.dataSource.idSprLineaAccion) {
      this.actividadesPlanN5Service
        .list('?idSprLineaAccion=' + this.dataSource.idSprLineaAccion)
        .subscribe((listaActividades) => {
          this.listaActividadesN5 = listaActividades;
        });
    } else {
      this.actividadesPlanN5Service
        .list('?idSprPlanAccion=' + this.dataSource.idSprPlanAccion)
        .subscribe((listaActividades) => {
          this.listaActividadesN5 = listaActividades;
        });
    }
  }

  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  filtrarActividades(listaActividades: any, obj: any) {
    if (obj.idSprLineaAccion) {
      return listaActividades.filter((actividad: any) => {
        return actividad.idSprLineaAccion === obj.idSprLineaAccion;
      });
    } else {
      return listaActividades.filter((actividad: any) => {
        return actividad.idSprPlanAccion === obj.idSprPlanAccion;
      });
    }
  }

  createActividadesPlanaccionN5() {
    this.formActividadesPlanN5.value.usuario = this.currentUser.idSprUsuario;
    this.formActividadesPlanN5.value.ip = this.ipAddress;

    if (this.dataSource.idSprLineaAccion) {
      this.formActividadesPlanN5.value.idSprLineaAccion =
        this.dataSource.idSprLineaAccion;
    } else {
      this.formActividadesPlanN5.value.idSprPlanAccion =
        this.dataSource.idSprPlanAccion;
    }
    this.formSubmitted = true;
    console.log(this.formActividadesPlanN5.value);
    let FechaInicial = this.formActividadesPlanN5.value.fechaInicio;
    let FechaCumplimiento = this.formActividadesPlanN5.value.fechaCumplimiento;
    if (FechaInicial > FechaCumplimiento) {
      this.alertService.alert(
        'ERROR',
        'La fecha inicial no puede ser mayor a la fecha de cumplimiento',
        'error'
      );
    }
    if (
      !this.formActividadesPlanN5.invalid &&
      FechaInicial < FechaCumplimiento
    ) {
      //Realizar el posteo
      if (this.formActividadesPlanN5.value.idSprActividad == null) {
        this.formActividadesPlanN5.value.fechaInicio = FechaInicial;
        this.formActividadesPlanN5.value.fechaCumplimiento = FechaCumplimiento;
        this.actividadesPlanN5Service
          .createActividadesPlanN5(this.formActividadesPlanN5.value)
          .subscribe(
            (resp) => {
              this.getActividades();
              this.modal.closeId(this.nameModal);
              this.alertService.createOk();
            },
            (err) => {
              this.alertService.createError();
            }
          );
      } else {
        this.actividadesPlanN5Service
          .updateActividadesPlanN5(this.formActividadesPlanN5.value)
          .subscribe(
            (resp) => {
              this.getActividades();
              this.modal.closeId(this.nameModal); //
              this.alertService.updateOk(
                'Felicitaciones!',
                'Registro actualizado correctamente'
              );
            },
            (err) => {
              this.alertService.createError();
            }
          );
      }
    } else {
      return;
    }
  }

  updateActividades(obj: ActividadesInterface) {
    console.log('update', obj);
    this.modal.open(this.nameModal);
    this.formActividadesPlanN5.patchValue({
      idSprActividad: obj.idSprActividad,
      idSprPlanAccion: obj.idSprPlanAccion,
      nombre: obj.nombre,
      fechaInicio: obj.fechaInicio,
      fechaCumplimiento: obj.fechaCumplimiento,
      peso: obj.peso,
      cumplimiento: obj.cumplimiento,
      respaldo: obj.respaldo,
      estado: obj.estado,
    });
  }

  getDataPlanesAccionN5() {
    console.log(
      'AQUI ME TRAE DATOS DEL AMBIENTE',
      this.currentUser.idSprAmbiente
    );
    this.planAccionservice.list().subscribe((resp) => {
      this.dataPlanAccionN5 = resp;
      console.log('Data get:', this.dataPlanAccionN5);
    });
  }

  getDataObjetivo() {
    this.planAccionservice.list().subscribe((resp) => {
      this.dataObjetivoN5 = resp;
      console.log('Data get:', this.dataObjetivoN5);
    });
  }

  deleteActividades(idRegister: number) {
    this.modal.open('deleteActivities');
    this.idDeleteRegister = idRegister;
  }

  // deleteActividad(actividad: any) {
  //   this.actividadesPlanN5Service.delete(actividad).subscribe(
  //     (resp) => {
  //       this.getActividades();
  //       // this.modal.close();
  //       this.modal.closeId('deleteActivities');
  //       console.log('plan de accion creado correctamente');
  //       console.log(resp);
  //       this.alertService.deleteOk();
  //     },
  //     (err) => {
  //       this.alertService.deleteError();
  //     }
  //   );
  // }

  getNombreObjetivo(id: number, objetivos: Objetivo[]) {
    return objetivos.filter((objetivo) => {
      return objetivo.idSprObjetivo === id;
    });
  }

  onResetForm() {
    this.formSubmitted = false;
    this.formActividadesPlanN5.reset();
  }

  openModal() {
    this.onResetForm();
    this.modal.open(this.nameModal);
  }

  closeModal() {
    this.modal.close();
  }

  closeModalFooter() {
    this.modal.closeId(this.nameModal);
  }

  closeModalEliminar() {
    this.modal.closeId('deleteActivities');
  }

  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.actividadesPlanN5Service
        .delete({
          idSprActividad: this.idDeleteRegister,
          usuario: this.currentUser.idSprUsuario,
          delLog: 'S',
          ip: this.ipAddress,
        })
        .subscribe(
          (resp) => {
            this.getActividades();
            console.log(resp);
            this.alertService.deleteOk();
            this.initApp();
            this.modal.closeId('deleteActivities');
          },
          (err) => {
            this.alertService.deleteError();
          }
        );
    }
  }
}
