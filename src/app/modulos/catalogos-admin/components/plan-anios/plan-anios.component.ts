import { ChangeDetectorRef, Component } from '@angular/core';
import { PlanAniosService } from '../../services/plan-anios.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { AlertService } from 'src/app/services/alert.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-plan-anios',
  templateUrl: './plan-anios.component.html',
  styleUrls: ['./plan-anios.component.css'],
})
export class PlanAniosComponent {

  breadCrumbItems = [{label: 'Administración Procesos'}, {label: 'Gestión Planes'}, {label: 'Plan Años', active: true}];

  public mostrarModal: boolean = false;
  public dataCatalogoAnios:any=[];
  public formSubmitted = false;
  public formAnios!: FormGroup;
  public dataPlanIns!: any;
  public idSprUsuario: any;
  public ipAddress!: string;
  public dataAniosSelect: any = [];
  public selectPlan: number = 0;
  public anioInicio!: number;
  public anioFin!: number;
  public fecha: string = '2022-01-01';
  public idSprAmbiente: any;
  public currentAmbiente: any;
  filtroPost = '';
  descriptionApp = localStorage.getItem('descriptionApp');
  buffer!: any;
  currentUser!: any;
  private idDeleteRegister: number = 0;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public nameModal: string = 'modalNewEdit';
  isDtInitialized: boolean = false;
  dtElement: DataTableDirective;
  public nameApp = 'Plan Años';
  namePlanAnios= 'PLANES ANUALES'
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private catalogoAniosService: PlanAniosService,
    private ip: IpPublicService,
    private alert: AlertService,
    public modal: ModalService,
    private cdRef: ChangeDetectorRef,
    
  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.idSprAmbiente = this.currentUser.idSprAmbiente;
    this.currentAmbiente = JSON.parse(this.buffer);
  }

  ngOnInit() {
    this.getIpPublic();
    this.initApp();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  initApp() {
    this.setDataTable();
    this.setForm();
    this.getPlanAnios();

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  setForm() {
    this.formAnios = this.fb.group({
      idSprAnio: [0],
      idSprPlanInstitucional: ['', [Validators.required]],
      anio: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      vigencia: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
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

  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }



  selectPlanAnio(event: any, dataPlanIns: any[]) {
   
      let planInstitu = dataPlanIns.filter((plan: any) => {
      return +plan.idSprPlanInstitucional === +event;

    });
    let anioInicial = +planInstitu[0].fechaInicio.slice(0, 4);
    let anioFin = +planInstitu[0].fechaFin.slice(0, 4);
    let aniosPlan = [];

    while (anioInicial <= anioFin) {
      aniosPlan.push(anioInicial); 
      anioInicial++;
    }
    this.dataAniosSelect = aniosPlan;
      
    
   
  }

  createPlanAnios() {
    if (this.formAnios.value.fechaInicio > this.formAnios.value.fechaFin) {
  
      this.alert.error(
        "ERROR",
        "La fecha inicial no puede ser mayor a la fecha final");
      return false;
    }
    this.formSubmitted = true;
    this.isSubmitted = true;
    console.log('Data  guardar: ', this.formAnios.value.fechaInicio);
    this.formAnios.value.usuario = this.currentUser.idSprUsuario;
  
    this.formAnios.value.ip = this.ipAddress;
 
    if (!this.formAnios.invalid) {
      //Realizar el posteo
      if (this.formAnios.value.idSprAnio == null) {
        this.formAnios.value.delLog = 'N';
        
        this.catalogoAniosService.create(this.formAnios.value).subscribe(
          (resp) => {
            this.closeModal();
            this.getPlanAnios();

            this.alert.createOk('Correcto', 'Registro creado exisitosamente');
          },
          (err) => {
            this.alert.createError('Ocurrrió un error al crear el registro');

            //  this.catalogoAniosService.delete(this.formAnios.value).subscribe();
          }
        );
      } else {
        this.catalogoAniosService.update(this.formAnios.value).subscribe(
          (resp) => {
            this.isSubmitted = true;
            this.closeModal();
            this.getPlanAnios();
            this.alert.createOk(
              'Correcto',
              'Registro actualizado exisitosamente'
            );
          },
          (err) => {
            this.alert.createError(
              'Ocurrrió un error al actualziar el registro'
            );
         
          }
        );
      }
      return false;
    } else {
      return false;
    }
  }


  updatePlanAnios(obj: any) {
    this.modal.open(this.nameModal);
    this.formAnios.patchValue({
      idSprAnio: obj.idSprAnio,
      idSprPlanInstitucional: obj.idSprPlanInstitucional,
      anio: obj.anio,
      fechaInicio: obj.fechaInicio,

      fechaFin: obj.fechaFin,
      vigencia: obj.vigencia,
      estado: obj.estado,
    });
  }

  getPlanAnios() {
    this.catalogoAniosService.list().subscribe((resp) => {
      this.dataCatalogoAnios = resp;
      this.getDataPlanIns();
    });
  }

  getDataPlanIns() {
    this.catalogoAniosService.getDataPlanIns().subscribe((resp) => {
      // this.dataobjetivon1: se muestra en el formulario
      this.dataPlanIns = resp;
      // console.log('Data get Plan :', this.dataPlanIns);
      this.reDrawDataTable();
    });
  }

  // Modal Crear/editar

  openModal() {
    this.onResetForm();
    this.modal.open(this.nameModal);
  }

  onResetForm() {
    this.formSubmitted = false;
    this.formAnios.reset();
  }

  closeModal() {
    this.modal.close();
  }

 


  confirmDelete() {
    if (this.idDeleteRegister > 0) {

           this.catalogoAniosService
        .delete({
          idSprAnio: this.idDeleteRegister,
          usuario: this.currentUser.idSprUsuario,
          delLog: 'S',
          ip: this.ipAddress,
        })
        .subscribe(
          (resp) => {
            this.getPlanAnios();
            console.log(resp);
            this.alert.deleteOk();
            this.initApp();
            this.modal.closeId('deleteAnios');
          },
          (err) => {
            this.alert.deleteError();
          }
        );
    }
  }





  deletePlanAnios(idRegister: number) {
    this.modal.open('deleteAnios');
    this.idDeleteRegister = idRegister;
  }
}
