import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subsistema } from '../../../catalogos-proces/models/subsistema';
import { SubsistemaService } from '../../../catalogos-proces/services/subsistema.service';
import { Subject } from 'rxjs';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from 'src/app/services/modal.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { DataTableDirective } from 'angular-datatables';
import { AmbienteService } from '../../../catalogos-proces/services/ambiente.service';
import { error } from 'console';

@Component({
  selector: 'app-subsistema',
  templateUrl: './subsistema.component.html',
  styleUrls: ['./subsistema.component.css']
})
export class SubsistemaComponent implements OnInit, OnDestroy {
  breadCrumbItems = [{ label: 'Administración Sistema' }, { label: 'Administración' }, { label: 'Subsistemas', active: true }];
  subsistemas: any[] = [];
  submitted = false;
  currentUser!: any;
  ipAddress!: string;
  idSprUsuario: any;
  nameModal: string = 'modalEdit';
  idSprRegisterDelete: number = 0;
  estados: any[] = [];
  nameApp = 'Subsistemas';
  private buffer!: any;
  selectItems: any[] = [];
  formSubsistema!: UntypedFormGroup;
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private subsistemaService: SubsistemaService,
    private alertService: AlertService,
    public modal: ModalService,
    private ip: IpPublicService,
    private ambienteService: AmbienteService
  ) {
    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.selectItems = [
      { value: 0, label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ]
  }

  get subSistForm() {
    return this.formSubsistema.controls;
  }

  setDataTable():void{
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
      }
    };
  }


  setForm(){
    this.formSubsistema = this.fb.group({
      idSprSubsistema: [],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      ponderacion: ['', [Validators.required]],
      aportaValor: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
    this.formSubsistema.patchValue({
      estado: this.selectItems[0].value
    });
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
  reDrawDataTable(): boolean {
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
    return true;
  }

  initApp() {
    this.getDataSubsistemas();
    this.setDataTable();
    this.setForm();
  }

  ngOnInit(): void {
    this.getIpPublic();
    this.initApp();
  }
  getDataSubsistemas():void{
    this.subsistemaService.list().subscribe(resp => {
      this.subsistemas = resp;
      this.reDrawDataTable();
    });
  }

  onSubmit() {
    this.submitted = true;
    this.formSubsistema.value.nombre = this.formSubsistema.value.nombre.toUpperCase();
    this.formSubsistema.value.ip = this.ipAddress;
    this.formSubsistema.value.usuario = this.currentUser.idSprUsuario;
    if (!this.formSubsistema.invalid) {
      if (this.formSubsistema.value.idSprSubsistema == null || this.formSubsistema.value.idSprSubsistema == " ") {
        this.subsistemaService.create(this.formSubsistema.value).subscribe(dataInsert => {
          this.initApp();
          this.alertService.createOk();
          this.modal.close();
        }), error => ({

        })
      } else {
        this.subsistemaService.update(this.formSubsistema.value).subscribe(dataUpdate => {
          this.initApp();
          this.alertService.updateOk();
          this.modal.close();
        }), error => ({

        })
      }
    } else {
      this.alertService.warning("Atención", "Formulario invalido.");
    }
  }

  edit(obj: Subsistema) {
    this.openModalNew();
    this.formSubsistema.patchValue({
      idSprSubsistema: obj.idSprSubsistema,
      descripcion: obj.descripcion,
      ponderacion: obj.ponderacion,
      aportaValor: obj.aportaValor,
      nombre: obj.nombre,
      estado: obj.estado
    });
  }

  openModalNew() {
    this.onResetForm();
    this.modal.open(this.nameModal);
  }


  onResetForm() {
    this.submitted = false;
    this.formSubsistema.reset();
  }

  delete(id: number) {
    this.idSprRegisterDelete = id;
    this.modal.open('del');
  }

  confirmDelete() {
    if (this.idSprRegisterDelete > 0) {
      this.ambienteService.list(`?idSprSubsistema=${this.idSprRegisterDelete}&delLog=N`)
        .subscribe(response => {

          if (response.length < 1) {
            this.subsistemaService.update({
              "idSprSubsistema": this.idSprRegisterDelete,
              "usuario": this.currentUser.idSprUsuario,
              "delLog": "S",
              "ip": this.ipAddress
            }).subscribe(resp => {
              this.initApp();
              this.alertService.deleteOk();
              this.modal.close();
            }, (err) => {
              this.alertService.deleteError();
              this.modal.close();
            });
          } else {
            this.alertService.warning("Atención", "No se puede borrar este registro, existe información relacionada!")
            this.modal.close();
          }
        });
    } else {
      this.alertService.warning("Atención", "Ocurrió un error al intentar borrar el registro");
      this.modal.close();
    }
  }

  closeModal(){
    this.modal.close();
  }


}
