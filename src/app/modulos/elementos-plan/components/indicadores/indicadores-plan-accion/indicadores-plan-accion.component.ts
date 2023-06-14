import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {PlanAccionService} from '../../../services/plan.accion.service';
import { ModalService } from '../../../../../services/modal.service';
import { AlertService } from '../../../../../services/alert.service';
import { IndicadoresService } from '../../../services/indicadores.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ObjetivoService } from '../../../services/objetivo.service';

@Component({
  selector: 'app-indicadores-plan-accion',
  templateUrl: './indicadores-plan-accion.component.html',
  styleUrls: ['./indicadores-plan-accion.component.css']
})
export class IndicadoresPlanAccionComponent {
  public formPlanAccionIndicadores: UntypedFormGroup;
  public submitted = false;
  public dataPlanAccionIndicadores: any = [];
  public dataPlanAccion: any = [];
  public dataObjetivo!: any;// trae data de objetivos
  private idDeleteRegister: number = 0;
  private currentUser!: any;
  public dataIndicadores: any[] = [];
  private ipAddress!: string;
  private buffer!: any;
  public nameModal: string = 'PlanAccion-modalNewEdit'
  public nameApp = 'Plan Accion Indicadores....';
  public selectItems:any = [];
  private idSprAmbiente:number =0;

  @Input() set init3(planAccion: any) {
    this.initApp(planAccion);

  }

    constructor(
      public modal:ModalService,
      private indicadorService:IndicadoresService,
      private ip: IpPublicService,
      private alert: AlertService,
      private fb: FormBuilder,
      private planAccionService:PlanAccionService,
      private objetivoService: ObjetivoService
    ){

      this.buffer = localStorage.getItem('currentUser');
      this.currentUser = JSON.parse(this.buffer);
      this.selectItems = [
        { value: '', label: 'Selecione..' },
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Inactivo' },
      ];
      this.idSprAmbiente = this.currentUser.idSprAmbiente;
      console.log('CONSTRUCTOR Plan DE ACCION: ' );

    }


    initApp(data:string = 'planAccion'){
      if(data == 'planAccion'){
    console.log('true Recibiendo data: ',data );
        this.getDataObjetivos();
  }

    }



    getDataObjetivos(){
      this.objetivoService.list(`?idSprAmbiente= ${this.idSprAmbiente}`).subscribe((resp) => {
        this.dataObjetivo = resp;
        console.log('OBJETIVOS::::::::.: ', this.dataObjetivo );
        this.initPlanAccionIndicadores();

      });
    }

    initPlanAccionIndicadores(){
      this.planAccionService.list().subscribe((resp) => {
        this.dataPlanAccion = resp;
        console.log('PlanAccion***: ', this.dataPlanAccion );
        this.getDataIndicadores();
      });
    }

    getDataIndicadores(){
      this.indicadorService.list().subscribe((resp) => {
        this.dataIndicadores = resp;
        console.log('Indicadores: ', this.dataIndicadores );
            this.mapeoObjetivoPlan();
      });
    }

    mapeoObjetivoPlan() {
      let dataProcess: any = [];
      let dataIndicador: any = [];
      for (let i = 0; i < this.dataObjetivo.length; i++) {
        for (let j = 0; j < this.dataPlanAccion.length; j++) {
          if ((this.dataObjetivo[i].idSprObjetivo == this.dataPlanAccion[j].idSprObjetivo)) {

            for (let k = 0; k < this. dataIndicadores.length; k++){
              if (this.dataIndicadores[k].idSprPlanAccion == this.dataPlanAccion[j].idSprPlanAccion){
                dataIndicador.push({
                  idSprIndicador:this.dataIndicadores[k].idSprIndicador,
                  idSprPlanAccion:this.dataIndicadores[k].idSprPlanAccion,
                  nombre:this.dataIndicadores[k].nombre,
                  descripcion:this.dataIndicadores[k].descripcion,
                  unidadInformacion:this.dataIndicadores[k].unidadInformacion,
                  fechaInicio:this.dataIndicadores[k].fechaInicio,
                  estado:this.dataIndicadores[k].estado,

                })
              }
            }

                //console.log(this.dataLineaAccion[k])
                dataProcess.push({
                  idSprPlanAccion: this.dataPlanAccion[j].idSprPlanAccion,
                  nombre: this.dataPlanAccion[j].nombre,
                  descripcion: this.dataPlanAccion[j].descripcion,
                  justificacion: this.dataPlanAccion[j].justificacion,
                  fechaInicio: this.dataPlanAccion[j].fechaInicio,
                  fechaFin: this.dataPlanAccion[j].fechaFin,
                  alcance: this.dataPlanAccion[j].alcance,
                  localidadImpacto: this.dataPlanAccion[j].localidadImpacto,
                  impactoProceso: this.dataPlanAccion[j].impactoProceso,
                  indicadores:dataIndicador
                });
                dataIndicador = [];
              }
        }
      }
      console.log("Mapeado planes accion: ", dataProcess);
      this.dataPlanAccionIndicadores = dataProcess;
    }



    get appForm() {
      return this.formPlanAccionIndicadores.controls;
    }

    ngOnInit(): void {
      this.getIpPublic();
      this.setFormPlanAccion();
      console.log('NG ONINIT Plan DE ACCION ' );
    }

    getIpPublic() {
      this.ip.getIPAddress().subscribe((res: any) => {
        this.ipAddress = res.ip;
      });
    }

    setFormPlanAccion(idSprPlanAccion:string=" "){
      this.formPlanAccionIndicadores = this.fb.group({
        idSprPlanAccion: [idSprPlanAccion],
        idSprIndicador: [],
        nombre: ['', [Validators.required]],
        descripcion: [''],
        unidadInformacion: ['', [Validators.required]],
        fechaInicio: ['', [Validators.required]],
        estado: ['', [Validators.required]],
      });
    }

  openModal(row:any){
    this.setFormPlanAccion(row.idSprPlanAccion);
      this.modal.open(this.nameModal);
  }

  delete(row: any) {
    console.log('Delete select...: ', row.idSprIndicador );
    this.idDeleteRegister = row.idSprIndicador;
    this.modal.open('delete-PlanAccion');
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
    this.setFormPlanAccion(obj.idSprPlanAccion)
    this.formPlanAccionIndicadores.patchValue({
      idSprPlanAccion: obj.idSprPlanAccion,
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
    this.formPlanAccionIndicadores.value.usuario = this.currentUser.idSprUsuario;
    this.formPlanAccionIndicadores.value.ip = this.ipAddress;
    this.formPlanAccionIndicadores.value.nombre = this.formPlanAccionIndicadores.value.nombre.toUpperCase();
        if (!this.formPlanAccionIndicadores.invalid) {
      if (this.formPlanAccionIndicadores.value.idSprIndicador == null) {
        this.indicadorService.create(this.formPlanAccionIndicadores.value).subscribe(
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
        this.indicadorService.update(this.formPlanAccionIndicadores.value).subscribe(
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
    this.formPlanAccionIndicadores.reset();
  }


}
