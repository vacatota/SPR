import { UmbralesService } from '../../services/umbrales.service';
import { umbrales } from '../../models/umbrales';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-umbrales',
  templateUrl: './umbrales.component.html',
  styleUrls: ['./umbrales.component.css']
})
export class UmbralesComponent implements OnInit, OnDestroy {

  breadCrumbItems = [{label: 'Administración Procesos'}, {label: 'Catálogos'}, {label: 'Umbrales', active: true}];

  public formUmbrales!: UntypedFormGroup;
  public submitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataApp: any[] = []; //Ruta catalogo umbrales
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameModal: string = 'modalNewEdit'
  public nameApp = 'Umbrales';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private UmbralesService: UmbralesService,
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

  get UmbralesForm() {
    return this.formUmbrales.controls;
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

    this.formUmbrales = this.fb.group({
      idSprUmbral: [],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      limiteSuperior: ['', [Validators.required]],
      limiteInferior: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
    this.formUmbrales.patchValue({
      estado: this.selectItems[0].value,
    });
  }

  initApp() {
  this.listDataUmbrales();
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

  listDataUmbrales() {
    this.UmbralesService.list().subscribe((resp) => {
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
//crear
  onSubmit() {

    if (this.formUmbrales.value.limiteSuperior < this.formUmbrales.value.limiteInferior) {
      this.alert.createError( "Límite Superior no puede ser menor a: límite Inferior.")
      return false;
    }
    this.submitted = true;
    this.formUmbrales.value.usuario = this.currentUser.idSprUsuario;
    this.formUmbrales.value.ip = this.ipAddress;
    this.formUmbrales.value.nombre = this.formUmbrales.value.nombre.toUpperCase();
    if (!this.formUmbrales.invalid) {
      if (this.formUmbrales.value.idSprUmbral == null) {
        this.UmbralesService.create(this.formUmbrales.value).subscribe(
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
        this.UmbralesService.update(this.formUmbrales.value).subscribe(
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
      return true;
    } else {
      return false;
    }
  }

  edit(obj: umbrales) {
    this.openModal();
    this.formUmbrales.patchValue({
      idSprUmbral: obj.idSprUmbral,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      limiteSuperior: obj.limiteSuperior,
      limiteInferior: obj.limiteInferior,
      estado: obj.estado
    });
  }

  delete(idRegister:number) {
    this.modal.open('delete-umbrales');
   this.idDeleteRegister= idRegister;
  }

  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.UmbralesService.delete(
        {"idSprUmbral":this.idDeleteRegister,
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
    this.formUmbrales.reset();
  }
}
