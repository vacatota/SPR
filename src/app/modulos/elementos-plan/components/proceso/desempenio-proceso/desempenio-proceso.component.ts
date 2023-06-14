import { ModalService } from './../../../../../services/modal.service';
import { AlertService } from './../../../../../services/alert.service';
import { IpPublicService } from './../../../../../services/ip-public.service';
import { Proceso } from './../../../models/proceso';
import { DesempenioProcesoService } from './../../../services/desempenio-proceso.service';
import { DesempenioProceso } from './../../../models/desempenioProceso';
import { Component, OnDestroy, OnInit, ViewChild , Input} from '@angular/core';
import { ProcesoService } from './../../../services/proceso.service';
import { FormBuilder, Validators, UntypedFormGroup, FormArray, FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ComunService } from 'src/app/modulos/catalogos-proces/services/comun.service';
@Component({
  selector: 'app-desempenio-proceso',
  templateUrl: './desempenio-proceso.component.html',
  styleUrls: ['./desempenio-proceso.component.css']
})
export class DesempenioProcesoComponent implements OnInit, OnDestroy {
  public formDesempenioProceso!: UntypedFormGroup;
  public submitted = false;
  public formSubmitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataDesempenioProceso: any[] = [];
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameModal: string = 'desempenio-proceso';
  public nombreUnidad!: any;
  public dataProcesos: any[] ;
  public dataCatComun!: any;
  public dataCaracteristicas!: any;
  public dataImportancia!: any;
  public dataDesempenio!: any;
  idSprAmbiente!: number;
  idRecursivoCaracteristicas: number = 262;
  idRecursivoImportancia: number = 265;
  idRecursivoDesempenio: number = 268;
  idSprProceso:number = 0;
  nameApp = '';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  @Input() set init(desempenioObj:any) {
    this.idSprProceso = desempenioObj.idSprProceso;
    this.nameApp = desempenioObj.nombre;
    console.log('idSprProceso: ', this.idSprProceso );
    this.initApp();
   }

  constructor(
    private fb: FormBuilder,
    private ProcesoService: ProcesoService,
    private DesempenioProcesoService: DesempenioProcesoService,
    private comunService: ComunService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService
  ) {

    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.nombreUnidad = this.currentUser.nombreUnidad;
    //
    this.selectItems = [
      { value: '', label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
  }

  get DesempenioProcesoForm() {
    return this.formDesempenioProceso.controls;
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

    this.formDesempenioProceso = this.fb.group({
      idSprDesempenioProceso: [],
      idSprProceso: [this.idSprProceso],
      idSprDesempenio: ['', [Validators.required]],
      idSprCaracteristica: ['', [Validators.required]],
      idSprImportancia: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      calificacion: ['', [Validators.required]],
      accionTomar: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
    this.formDesempenioProceso.patchValue({
      estado: this.selectItems[0].value,
    });
  }



  initApp(){
    //this.idSprAmbiente = this.currentUser.idSprAmbiente
  this.listDesempenioProceso(this.idSprProceso);
  this.listProcesos(this.idSprAmbiente);
  this.setDataTable();
  this.listCaracteristicas();
  this.listImportancia();
  this.listDesempenio();
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


//data proceso
  listProcesos(idSprAmbiente: any) {
    console.log('idSprAmbiente: ', idSprAmbiente);
    this.ProcesoService.list('?idSprAmbiente=' + idSprAmbiente)
      .subscribe(resp => {
        this.dataProcesos = resp;

        this.listDesempenioProceso(this.idSprAmbiente);
      })
    }
//data desempeño del proceso
    listDesempenioProceso(idSprProceso: any) {
      this.DesempenioProcesoService.list('?idSprProceso=' + idSprProceso).subscribe((resp) => {
        this.dataDesempenioProceso = resp;
        console.log('Data desempeño: ', this.dataDesempenioProceso );
        this.reDrawDataTable();

      });
    }
//ctalogo comun Caracteristicas de proceso
    listCaracteristicas() {
      this.comunService.list()
        .subscribe(resp => {
          this.dataCaracteristicas = this.getDataDependiente(resp, this.idRecursivoCaracteristicas);
          this.mapearDataComunes()
        })
    }
//catalogo comun Importancia
    listImportancia() {
      this.comunService.list()
        .subscribe(resp => {
          this.dataImportancia = this.getDataDependiente(resp, this.idRecursivoImportancia);
          this.mapearDataComunes()
        })
    }
    //catalogo comun Desempeño Proceso
    listDesempenio() {
      this.comunService.list()
        .subscribe(resp => {
          this.dataDesempenio = this.getDataDependiente(resp, this.idRecursivoDesempenio);
          this.mapearDataComunes()
        })
    }

    getDataDependiente(dataObj: any, spr_idSprComun: any = null) {
      let stateOptionTipo = false;
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

    mapearDataComunes() {
      for (let i = 0; i < this.dataDesempenioProceso.length; i++) {
        for (let j = 0; j < this.dataImportancia.length; j++) {
          if ((this.dataImportancia[j].idSprComun === this.dataDesempenioProceso[i].idSprTipoProceso)) {
            for (let k = 0; k < this.dataCatComun.length; k++) {
            if ((this.dataCatComun[k].idSprComun === this.dataDesempenioProceso[i].idSprTipoCliente)) {
                  for (let m = 0; m < this.dataCaracteristicas.length; m++) {
                    if ((this.dataCaracteristicas[m].idSprComun === this.dataDesempenioProceso[i].idSprCaracteristica)) {
            this.dataDesempenioProceso[i].importancia= this.dataImportancia[j].nombre;
             this.dataDesempenioProceso[i].tipoCliente= this.dataCatComun[k].nombre;
             this.dataDesempenioProceso[i].caracteristicas= this.dataCaracteristicas[m].nombre;
          }
        }
      }
    }
      }
    }
  }
    }

      //console.log("Data proceso-tipocliente: ", this.dataProceso)

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
    this.formDesempenioProceso.value.idSprProceso = this.idSprProceso;
    this.formDesempenioProceso.value.usuario = this.currentUser.idSprUsuario;
    this.formDesempenioProceso.value.ip = this.ipAddress;
    this.formDesempenioProceso.value.nombre = this.formDesempenioProceso.value.nombre.toUpperCase();
    this.submitted = true;
    console.log('Data guardar: ',this.formDesempenioProceso.value );
    if (!this.formDesempenioProceso.invalid) {
      if (this.formDesempenioProceso.value.idSprDesempenioProceso == null || this.formDesempenioProceso.value.idSprDesempenioProceso == " ") {
        this.DesempenioProcesoService.create(this.formDesempenioProceso.value).subscribe(
          (resp) => {
            console.log('Creado Ok: ', );
            this.closeModalDesempenio()
            this.alert.createOk();
            this.initApp();
          },
          (err) => {
            this.alert.createError();
          }
        );
      } else {
        this.DesempenioProcesoService.update(this.formDesempenioProceso.value).subscribe(
          (resp) => {
            this.closeModalDesempenio()
            this.alert.updateOk();
            this.initApp();
          },
          (err) => {
            this.alert.updateError();
          }
        );
      }
      return true;
    } else {
      console.log('Formulario invalido: ', );
      return false;
    }
  }

  edit(obj: DesempenioProceso) {

    this.openModal();
    this.formDesempenioProceso.patchValue({
      idSprDesempenioProceso: obj.idSprDesempenioProceso,
      idSprProceso: obj.idSprProceso,
      idSprDesempenio: obj.idSprDesempenio,
      idSprCaracteristica: obj.idSprCaracteristica,
      idSprImportancia: obj.idSprImportancia,
      nombre: obj.nombre,
      calificacion: obj.calificacion,
      accionTomar: obj.accionTomar,
      estado: obj.estado
    });
  }



  deleteDesempenio(idRegister:number) {
    this.modal.open('delete-desempenio');

   this.idDeleteRegister= idRegister;
  }

  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.DesempenioProcesoService.delete(
        {"idSprDesempenioProceso":this.idDeleteRegister,
        "usuario":this.currentUser.idSprUsuario,
        "delLog":"S",
        "ip":this.ipAddress
      }
      )
        .subscribe(resp => {
          this.initApp();
          this.modal.closeId('delete-desempenio');
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
    this.formDesempenioProceso.reset();
  }

  closeModalDesempenio(){

  this.modal.closeId('desempenio-proceso');
  }

}
