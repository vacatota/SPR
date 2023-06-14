import { PlanInstitucional } from '../../models/plan-institucional';
import { PlanInstitucionalService } from '../../services/plan-institucional.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-plan-institucional',
  templateUrl: './plan-institucional.component.html',
  styleUrls: ['./plan-institucional.component.css']
})
export class PlanInstitucionalComponent implements OnInit, OnDestroy {
  public formPlanInstitucional!: UntypedFormGroup;
  public submitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataApp: any[] = [];
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameModal: string = 'modalNewEdit'
  nameApp = 'Catálogo de roles';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private planInstitucionalService: PlanInstitucionalService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService
  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.selectItems = [
      { value: '', label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
  }

  get rolForm() {
    return this.formPlanInstitucional.controls;
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
    this.formPlanInstitucional = this.fb.group({
      idSprPlanInstitucional: [],
      nombre: ['',[Validators.required]],
      descripcion: ['',[Validators.required]],
      mision: ['',[Validators.required]],
      vision: ['',[Validators.required]],
      fechaInicio: ['',[Validators.required]],
      fechaFin: ['',[Validators.required]],
      estado: this.selectItems[0].value,
    });
  }

  initApp() {
  this.listDataApp();
  this.setDataTable();
  this.setForm(); 
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

  listDataApp() {
    this.planInstitucionalService.list().subscribe((resp) => {
      this.dataApp = resp;
      this.reDrawDataTable();
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

  onSubmit() {
    if(this.formPlanInstitucional.value.fechaInicio > this.formPlanInstitucional.value.fechaFin){
      this.alert.fechaError();
      return false;
    }  
    this.submitted = true;
    this.formPlanInstitucional.value.usuario = this.currentUser.idSprUsuario;
    this.formPlanInstitucional.value.ip = this.ipAddress;
    this.formPlanInstitucional.value.nombre = this.formPlanInstitucional.value.nombre.toUpperCase();
    if (!this.formPlanInstitucional.invalid) {
      if (this.formPlanInstitucional.value.idSprPlanInstitucional == null) {
        this.planInstitucionalService.create(this.formPlanInstitucional.value).subscribe(
          (resp) => {
            this.initApp();
            this.modal.close();
            this.alert.createOk();
          },
          (err) => {
            this.alert.createError();
          }
        );
      } else {
        this.planInstitucionalService.update(this.formPlanInstitucional.value).subscribe(
          (resp) => {
            this.initApp();
            this.modal.close();
            this.alert.updateOk();
          },
          (err) => {
            this.alert.updateError();
          }
        );
      }
    } else {
      return false;
    }
    return false;
  }

  edit(obj: PlanInstitucional) {
    this.openModal();
    this.formPlanInstitucional.patchValue({
      idSprPlanInstitucional: obj.idSprPlanInstitucional,
        nombre: obj.nombre,
        descripcion: obj.descripcion, 
        mision: obj.mision,
        vision: obj.vision,
        fechaInicio: obj.fechaInicio,
        fechaFin: obj.fechaFin,
        estado: obj.estado
    });
  }
  
  delete(idRegister:number) {
    this.modal.open('delete');
   this.idDeleteRegister= idRegister;
  }
  
  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.planInstitucionalService.delete(      
        {"idSprPlanInstitucional":this.idDeleteRegister, 
        "usuario":this.currentUser.idSprUsuario, 
        "delLog":"S",
        "ip":this.ipAddress
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

  onResetForm(){
    this.submitted = false;
    this.formPlanInstitucional.reset();
  }
}
