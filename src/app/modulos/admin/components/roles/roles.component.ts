import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { IpPublicService } from '../../../../services/ip-public.service';
import { ModalService } from '../../../../services/modal.service';
import { AlertService } from '../../../../services/alert.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { RolService } from '../../services/rol.service';
import { Rol } from './../../models/rol';

@Component({
  selector: 'cat-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit, OnDestroy {
  breadCrumbItems = [{label: 'Administración Sistema'}, {label: 'Catálogos'}, {label: 'Roles', active: true}];
  public formRol!: UntypedFormGroup;
  public submitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataApp: any[] = [];
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameModal: string = 'modalNewEdit'
  nameApp = 'Roles';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
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
    return this.formRol.controls;
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
    this.formRol = this.fb.group({
      idSprRol: [],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
    this.formRol.patchValue({
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
    this.rolService.list().subscribe((resp) => {
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
    this.formRol.value.usuario = this.currentUser.idSprUsuario;
    this.formRol.value.ip = this.ipAddress;
    this.formRol.value.nombre = this.formRol.value.nombre.toUpperCase();
    if (!this.formRol.invalid) {
      if (this.formRol.value.idSprRol == null) {
        this.rolService.create(this.formRol.value).subscribe(
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
        this.rolService.update(this.formRol.value).subscribe(
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

  edit(obj: Rol) {
    this.openModal();
    this.formRol.patchValue({
      idSprRol: obj.idSprRol,
      descripcion: obj.descripcion,
      nombre: obj.nombre,
      estado: obj.estado,
    });
  }
  
  delete(idRegister:number) {
    this.modal.open('delete-roles');
   this.idDeleteRegister= idRegister;
  }
  
  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.rolService.delete(      
        {"idSprRol":this.idDeleteRegister, 
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
    this.formRol.reset();
  }
}