import { Area } from '../../models/area';
import { AreaService } from '../../services/area.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
})
export class AreaComponent implements OnInit, OnDestroy {

  breadCrumbItems = [{label: 'Formulación'}, {label: 'Ambientes'}, {label: 'Gestión Areas', active: true}];

  public formAreas!: UntypedFormGroup;
  public submitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataApp: any[] = [];
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameUnidad!: any;

  public nameModal: string = 'modalNewEdit'
  nameApp = 'Gestión Areas';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private areaService: AreaService,
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
    return this.formAreas.controls;
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
    this.formAreas = this.fb.group({
      idSprArea: [],
      idSprAmbiente: [],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      estado: ['', [Validators.required]],
    });
    this.nameUnidad = this.currentUser.nombreUnidad;
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
    this.areaService.list('?idSprAmbiente='+ this.currentUser.idSprAmbiente)
    .subscribe((resp) => {
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
    this.submitted = true;
    this.formAreas.value.usuario = this.currentUser.idSprUsuario;
    this.formAreas.value.ip = this.ipAddress;
    this.formAreas.value.nombre = this.formAreas.value.nombre.toUpperCase();
    this.formAreas.value.idSprAmbiente = this.currentUser.idSprAmbiente;
    if (!this.formAreas.invalid) {
      if (this.formAreas.value.idSprArea == null) {
        this.areaService.create(this.formAreas.value).subscribe(
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
        this.areaService.update(this.formAreas.value).subscribe(
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
      return;
    }
  }

  edit(obj: Area) {
    this.openModal();
    this.formAreas.patchValue({
      idSprArea: obj.idSprArea,
      descripcion: obj.descripcion,
      nombre: obj.nombre,
      estado: obj.estado,
    });
  }

  delete(idRegister:number) {
    this.modal.open('delete-area');
   this.idDeleteRegister= idRegister;
  }

  confirmDelete() {
    console.log("prueba de borrado",this.idDeleteRegister)
    if (this.idDeleteRegister > 0) {
      this.areaService.delete(
        {"idSprArea":this.idDeleteRegister,
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
    this.formAreas.reset();
  }
}
