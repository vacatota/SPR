import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {ProcesoService} from '../../../services/proceso.service';
import { ModalService } from '../../../../../services/modal.service';
import { AlertService } from '../../../../../services/alert.service';
import { IndicadoresService } from '../../../services/indicadores.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-indicadores-procesos',
  templateUrl: './indicadores-procesos.component.html',
  styleUrls: ['./indicadores-procesos.component.css']
})
export class IndicadoresProcesosComponent {
  public formProcesosIndicadores: UntypedFormGroup;
  public submitted = false;
  public dataProcesosIndicadores: any = [];
  public dataProcesos: any = [];
  private idDeleteRegister: number = 0;
  private currentUser!: any;
  public dataIndicadores: any[] = [];
  private ipAddress!: string;
  private buffer!: any;
  public nameModal: string = 'procesos-modalNewEdit'
  public nameApp = 'Procesos Indicadores....';
  public selectItems:any = [];
  private idSprAmbiente:number =0;

  @Input() set init(proceso:any) {
   this.initApp(proceso);
  }

/*   dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  isDtInitialized: boolean = false;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
 */

  constructor(
    public modal:ModalService,
    private indicadorService:IndicadoresService,
    private ip: IpPublicService,
    private alert: AlertService,
    private fb: FormBuilder,
    private procesosService:ProcesoService
    ){

      this.buffer = localStorage.getItem('currentUser');
      this.currentUser = JSON.parse(this.buffer);
      this.selectItems = [
        { value: '', label: 'Selecione..' },
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Inactivo' },
      ];
      this.idSprAmbiente = this.currentUser.idSprAmbiente;
      console.log('CONSTRUCTOR PROCESOS: ' );

  }

  initApp(data:string = 'proceso'){
    if(data == 'proceso'){
  console.log('true Recibiendo data: ',data );
      this.initProcessIndicators();
}

  }

  initProcessIndicators(){
    this.procesosService.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
      this.dataProcesos = resp;
      console.log('Procesos***: ', this.dataProcesos );
      this.getIndicatorsProcess();
    });
  }

  getIndicatorsProcess() {
    this.indicadorService.list().subscribe((resp) => {
      this.dataIndicadores = resp;
      console.log('Indicadores-pro: ', this.dataIndicadores);
    this.mapingDataProcesosInidicadores();
    });
  }

  mapingDataProcesosInidicadores(){
    this.dataProcesosIndicadores =[]
    let indiceUno=0; let dataProcess: any = [];
    for (let i = 0; i < this.dataProcesos.length; i++){
      for (let j = 0; j < this.dataIndicadores.length; j++){
        if (this.dataProcesos[i].idSprProceso ==this.dataIndicadores[j].idSprProceso) {
          dataProcess.push({
            idSprIndicador: this.dataIndicadores[j].idSprIndicador,
            nombre: this.dataIndicadores[j].nombre,
            descripcion: this.dataIndicadores[j].descripcion,
            fechaInicio: this.dataIndicadores[j].fechaInicio,
            unidadInformacion: this.dataIndicadores[j].unidadInformacion,
            estado: this.dataIndicadores[j].estado,
            idSprProceso: this.dataProcesos[i].idSprProceso,
          });indiceUno++;
          }}
        this.dataProcesosIndicadores.push({
          nombre: this.dataProcesos[i].nombre,
          idSprProceso: this.dataProcesos[i].idSprProceso,
          indicadores:dataProcess
        }); dataProcess = [];
      }
  }





/*     reDrawDataTable(){
      // Redibujar la tabla al actualizar datos
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(true);
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next(true);
      }

    }*/

    get appForm() {
      return this.formProcesosIndicadores.controls;
    }

    ngOnInit(): void {
      this.getIpPublic();
      this.setFormProcesos();
      console.log('NG ONINIT PROCESOS ' );
    }
    getIpPublic() {
      this.ip.getIPAddress().subscribe((res: any) => {
        this.ipAddress = res.ip;
      });
    }


    setFormProcesos(idSprProceso:string=" "){
      this.formProcesosIndicadores = this.fb.group({
        idSprProceso: [idSprProceso],
        idSprIndicador: [],
        nombre: ['', [Validators.required]],
        descripcion: [''],
        unidadInformacion: ['', [Validators.required]],
        fechaInicio: ['', [Validators.required]],
        estado: ['', [Validators.required]],
      });
    }



    openModal(row:any) {
      //this.onResetForm();
      this.setFormProcesos(row.idSprProceso);
      this.modal.open(this.nameModal);
    }

  delete(row: any) {
    console.log('Delete select...: ', row.idSprIndicador );
    this.idDeleteRegister = row.idSprIndicador;
    this.modal.open('delete-procesos');
  }

  confirmDelete() {
    console.log('Delete confirm...: ' );
    if (this.idDeleteRegister > 0) {
      this.indicadorService.update({
        "idSprIndicador": this.idDeleteRegister,
        "usuario": this.currentUser.idSprUsuario,
        "delLog": "S",
        "ip": this.ipAddress
      }).subscribe(resp => {
        this.initApp();
        this.alert.deleteOk();
        this.modal.close();
      }, (err) => {
        this.alert.deleteError();
        this.modal.close();
      });
    }
  }

  edit(obj:any){
    this.onResetForm();
    console.log('Editar: ', obj );
    this.setFormProcesos(obj.idSprProceso)
    this.formProcesosIndicadores.patchValue({
      idSprProceso: obj.idSprProceso,
      idSprIndicador: obj.idSprIndicador,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      unidadInformacion: obj.unidadInformacion,
      fechaInicio: obj.fechaInicio,
      estado: obj.estado,
    });
    this.modal.open(this.nameModal);
    }


  onSubmit(){
    this.submitted = true;
    this.formProcesosIndicadores.value.usuario = this.currentUser.idSprUsuario;
    this.formProcesosIndicadores.value.ip = this.ipAddress;
    this.formProcesosIndicadores.value.nombre = this.formProcesosIndicadores.value.nombre.toUpperCase();
    //this.formProcesosIndicadores.value.idSprObjetivo = 314;// this.formProcesosIndicadores.value.nombre.toUpperCase();
     if (!this.formProcesosIndicadores.invalid) {
      if (this.formProcesosIndicadores.value.idSprIndicador == null) {
        console.log("Data guardar  :", this.formProcesosIndicadores.value)
        this.indicadorService.create(this.formProcesosIndicadores.value).subscribe(
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
        this.indicadorService.update(this.formProcesosIndicadores.value).subscribe(
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


  onResetForm(){
    this.submitted = false;
    this.formProcesosIndicadores.reset();
  }


}
