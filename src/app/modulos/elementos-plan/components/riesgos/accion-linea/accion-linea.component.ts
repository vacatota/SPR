import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { IpPublicService} from 'src/app/services/ip-public.service';
import { ModalService } from 'src/app/services/modal.service';
import { AlertService } from 'src/app/services/alert.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Accion } from '../../../models/accion';
import { AccionService } from '../../../services/accion.service';
import { CatComunService } from 'src/app/modulos/catalogos-admin/services/cat-comun.service';

@Component({
  selector: 'app-accion-linea',
  templateUrl: './accion-linea.component.html',
  styleUrls: ['./accion-linea.component.css']
})
export class AccionLineaComponent implements OnInit, OnDestroy{
  public formAccion!: UntypedFormGroup;
  public submitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataAccion: any[] = [];
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  //public nameModal: string = 'modalNewEdit'
  public nameModalAccionR: string = 'modalNewAccionRLinea';
  public nameAppAccion = 'Acciones';
  public idSprRiesgoInput!:any;
  public dataCatComun!: any;
  public idRecursivoTipoAccion: number = 255;
  public dataOut!: any;

  

  @Input() set data(dataOut) {
    console.log("Ingresa data",dataOut)
    this.initApp(dataOut);

    //this.idSprRiesgoInput = dataOut;
    //this. getDataAcciones();
  }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private accionService: AccionService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modalAccion: ModalService,
    public modal: ModalService,
    private catalogoComunService: CatComunService,
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
    return this.formAccion.controls;
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
    this.formAccion = this.fb.group({
      idSprAccion: [],
      idSprRiesgo: [],
      descripcion: ['', [Validators.required]],
      idSprTipoAccion: ['', [Validators.required]],
      fechaComprometida: ['', [Validators.required]],
      fechaCompletada: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getIpPublic();
    //this.initApp();
  }
  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  initApp(data: any) {
    this.idSprRiesgoInput = data;
  this.getDataAcciones();
  this.getDataCatalogoComun();
  this.setDataTable();
  this.setForm(); 
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  getDataAcciones() {
    this.accionService.list('?idSprRiesgo='+ this.idSprRiesgoInput)
      .subscribe(resp => {
        this.dataAccion = resp;
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
    this.formAccion.value.usuario = this.currentUser.idSprUsuario;
    this.formAccion.value.ip = this.ipAddress;
    this.formAccion.value.idSprRiesgo = this.idSprRiesgoInput;
    this.formAccion.value.descripcion = this.formAccion.value.descripcion.toUpperCase();
    console.log('data accion para guardar',this.formAccion.value)
    if (!this.formAccion.invalid) {
      if (this.formAccion.value.idSprAccion == null) {
        this.accionService.create(this.formAccion.value).subscribe(
          (resp) => {
            //this.initApp();
            this. getDataAcciones();
            this.modalAccion.closeId(this.nameModalAccionR);
            this.alert.createOk();
          },
          (err) => {
            this.alert.createError();
          }
        );
      } else {
        this.accionService.update(this.formAccion.value).subscribe(
          (resp) => {
            //this.initApp();
            this. getDataAcciones();
            this.modalAccion.closeId(this.nameModalAccionR);
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

  edit(obj: Accion) {
    this.openModalAccion();
    this.formAccion.patchValue({
      idSprAccion: obj.idSprAccion,
      idSprTipoAccion: obj.idSprTipoAccion,
      descripcion: obj.descripcion,
      fechaComprometida: obj.fechaComprometida,
      fechaCompletada: obj.fechaCompletada,
      estado: obj.estado
    });
  }
  
  delete(idRegister:number) {
    console.log("idRegister",idRegister);
   this.idDeleteRegister= idRegister;
   this.modalAccion.open('delA');
  }
  
  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.accionService.delete(      
        {"idSprAccion":this.idDeleteRegister, 
        "usuario":this.currentUser.idSprUsuario, 
        "delLog":"S",
        "ip":this.ipAddress
      }     
      )
        .subscribe(resp => {
          //this.initApp();
          this.modalAccion.closeId('delA')   
         this.alert.deleteOk(); 
        }, (err) => {
          this.alert.deleteError();        
        });
      }
  }

  getDataCatalogoComun() {
    this.catalogoComunService.list()
      .subscribe(resp => {
        this.dataCatComun = this.getDataDependiente(resp, this.idRecursivoTipoAccion);
      })
  }
  getDataDependiente(dataObj: any, spr_idSprComun: any = null) {
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

  openModal() {
    this.onResetForm();
   // this.modalAccion.open(this.nameModal);
  }

  openModalAccion() {
    this.setForm();
    //this.onResetForm();
    console.log("this.nameModalAccionR",this.nameModalAccionR)
    this.modalAccion.open(this.nameModalAccionR);
  }

  onResetForm(){
    this.submitted = false;
    this.formAccion.reset();
  }

}