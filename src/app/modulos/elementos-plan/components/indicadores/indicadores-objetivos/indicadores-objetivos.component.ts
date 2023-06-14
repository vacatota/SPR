import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ObjetivoService } from '../../../services/objetivo.service';
import { ParticipanteElementoService } from '../../../services/participante.elemento.service';
import { EquipoGerencialService } from 'src/app/modulos/catalogos-proces/services/equipo.gerencial.service';
import { ModalService } from 'src/app/services/modal.service';
import { AlertService } from './../../../../../services/alert.service';
import { IndicadoresService } from '../../../services/indicadores.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ComunService } from 'src/app/modulos/catalogos-proces/services/comun.service';
import { ConfiguracionIndicadores } from '../../../models/configuracionIndicadores';
@Component({
  selector: 'app-indicadores-objetivos',
  templateUrl: './indicadores-objetivos.component.html',
  styleUrls: ['./indicadores-objetivos.component.css']
})
export class IndicadoresObjetivosComponent {
  public formObjetivoIndicadores: UntypedFormGroup;
  public submitted = false;
  public dataObjetivoIndicadores: any = [];
  public dataObjetivo: any = [];
  public dataIndicadores: any[] = [];
  private idDeleteRegister: number = 0;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public nameModal: string = 'objetivo-modalNewEdit'
  public nameApp = 'Objetivo Indicadores';
  public selectItems:any = [];
  private idSprAmbiente:number =0;
  public nameModal1: string = 'modalNewEdit1'
  public dataResponsableProceso: any = [];
  public dataElementosParticpantes: any = [];
  public dataEquipoGerencial!: any;
  public dataTipoParticpacion: any = [];
  public configuracionIndicadores= [];
   public descripcionIndicador !: any;
   tipoParticipante = 293;

   @Input() set init(objetivo:any){
    this.initApp(objetivo);
  }
constructor(
    public modal: ModalService,
    private indicadorService:IndicadoresService,
    private ip: IpPublicService,
    private alert: AlertService,
    private fb: FormBuilder,
    private comunService: ComunService,
    private objetivoService:ObjetivoService,
    private participanteElementoService: ParticipanteElementoService,
    private equipoGerencialService: EquipoGerencialService,
){
  this.buffer = localStorage.getItem('currentUser');
  this.currentUser = JSON.parse(this.buffer);
  this.selectItems = [
    { value: '', label: 'Selecione..' },
    { value: 1, label: 'Activo' },
    { value: 2, label: 'Inactivo' },
  ];
  this.idSprAmbiente = this.currentUser.idSprAmbiente;
  console.log('COSTRUCTOR INDICADORES-OBJETIVOS: ' );
}

initApp(data:string = 'objetivo'){
  if(data == 'objetivo'){
console.log('Iniciando: ',data );
    this.initObjetivoIndicadores();
    this.listEquipoGerencial();
}

}
initObjetivoIndicadores(){
  this.objetivoService.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
    this.dataObjetivo = resp;
    //console.log('objetivo: ', this.dataObjetivo );
    this.getIndicadoresObjetivo();
  });
}
getIndicadoresObjetivo(){
  this.indicadorService.list().subscribe((resp) => {
    this.dataIndicadores = resp;
    console.log('Indicadores objetivo: ', this.dataIndicadores);
    //this.reDrawDataTable();
  this.mapingDataObjetivoIndicadores();
  });
}

getDataParticipanteElementos() {
  this.participanteElementoService.list('?estado=1').subscribe(resp => {
    this.dataElementosParticpantes = resp;
    console.log('Particip-elemento: ', this.dataElementosParticpantes);
    this.mapeoProcesosParticipante();
  });
}
mapeoProcesosParticipante() {
  let dataProcess = [];
  for (let i = 0; i < this.dataObjetivoIndicadores.length; i++) {
    for (let j = 0; j < this.dataElementosParticpantes.length; j++) {
      if (this.dataObjetivoIndicadores[i].idSprIndicador === this.dataElementosParticpantes[j].idSprIndicador) {
        for (let k = 0; k < this.dataEquipoGerencial.length; k++) {
          if (this.dataElementosParticpantes[j].idSprEquipoGerencial === this.dataEquipoGerencial[k].idSprEquipoGerencial) {
            this.dataObjetivoIndicadores[i].gradoNombres = this.dataEquipoGerencial[k].gradoNombres;
            this.dataObjetivoIndicadores[i].idSprEquipoGerencial = this.dataElementosParticpantes[j].idSprEquipoGerencial;
            this.dataObjetivoIndicadores[i].idSprParticipanteElemento = this.dataElementosParticpantes[j].idSprParticipanteElemento;
          }
        }
      }
    }
  }
  //this.dataResponsableProceso = dataProcess;
  console.log('Data procesos-particip: ', this.dataObjetivoIndicadores);

}
listEquipoGerencial() {
  console.log('idEquipo gerencial: ', this.idSprAmbiente);
  this.equipoGerencialService.list('?idSprAmbiente=' + this.idSprAmbiente).subscribe(dataEquipoGerencial => {
    this.dataEquipoGerencial = dataEquipoGerencial;
    this.getTipoParticipacion();
  })
}
getTipoParticipacion() {
  this.comunService.list("?spr_idSprComun=271").subscribe(respTipoParticipa => {
    this.dataTipoParticpacion = respTipoParticipa;
    //console.log('TIpo participa: ',this.dataTipoParticpacion );
    this.mapeoEquipoGerencialTipoParticipa();
  })
}
mapeoEquipoGerencialTipoParticipa() {
  let dataProcess = [];
  for (let i = 0; i < this.dataEquipoGerencial.length; i++) {
    for (let j = 0; j < this.dataTipoParticpacion.length; j++) {
      if (this.dataEquipoGerencial[i].idSprTipoParticipante === this.dataTipoParticpacion[j].idSprComun && this.dataEquipoGerencial[i].estado == 1 && this.dataEquipoGerencial[i].idSprTipoParticipante != this.tipoParticipante ) {
        dataProcess.push({
          idSprEquipoGerencial: this.dataEquipoGerencial[i].idSprEquipoGerencial,
          nombres: this.dataEquipoGerencial[i].gradoNombres,
          cedula: this.dataEquipoGerencial[i].cedula,
          participacion: this.dataTipoParticpacion[j].nombre
        })
      }
    }
  }
  this.dataResponsableProceso = dataProcess;

}

mapingDataObjetivoIndicadores(){
  this.dataObjetivoIndicadores =[]
let indiceUno=0; let dataProcess: any = [];
for (let i = 0; i < this.dataObjetivo.length; i++){
for (let j = 0; j < this.dataIndicadores.length; j++){
if (this.dataObjetivo[i].idSprObjetivo ==this.dataIndicadores[j].idSprObjetivo) {
  dataProcess.push({
  idSprIndicador: this.dataIndicadores[j].idSprIndicador,
  nombre: this.dataIndicadores[j].nombre,
  descripcion: this.dataIndicadores[j].descripcion,
  fechaInicio: this.dataIndicadores[j].fechaInicio,
  unidadInformacion: this.dataIndicadores[j].unidadInformacion,
  estado: this.dataIndicadores[j].estado,
  idSprObjetivo: this.dataObjetivo[i].idSprObjetivo,
  idSprResponsable:this.dataIndicadores[j].idSprResponsable
});indiceUno++;
}}
this.dataObjetivoIndicadores.push({
  nombre: this.dataObjetivo[i].nombre,
  idSprObjetivo: this.dataObjetivo[i].idSprObjetivo,
  indicadores:dataProcess
}); dataProcess = [];
}
console.log('DataObjetivosIndicadores: ',this.dataObjetivoIndicadores );
}

  get appForm() {
    return this.formObjetivoIndicadores.controls;
  }

  ngOnInit(): void {
    this.getIpPublic();
    this.setFormObjetivo();
  }

getIpPublic() {
  this.ip.getIPAddress().subscribe((res: any) => {
    this.ipAddress = res.ip;
  });
}


setFormObjetivo(idSprObjetivo:string=" "){
  this.formObjetivoIndicadores = this.fb.group({
    idSprObjetivo: [idSprObjetivo],
    idSprIndicador: [],
    idSprEquipoGerencialAnterior: ['', []],
    idSprParticipanteElemento: ['', []],
    idSprEquipoGerencial: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    descripcion: [''],
    unidadInformacion: ['', [Validators.required]],
    fechaInicio: ['', [Validators.required]],
    estado: ['', [Validators.required]],
  });
}




  delete(row: any) {
    this.idDeleteRegister = row.idSprIndicador;
    this.modal.open('delete-objetivo');
  }

  confirmDelete() {
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

configuracionInit(obj: any){
  this.descripcionIndicador = obj.nombre;
  this.configuracionIndicadores = obj;
this.openModal1();
}



edit(obj:any){
  this.onResetForm();
console.log('Editar: ', obj );
this.setFormObjetivo(obj.idSprObjetivo)
this.formObjetivoIndicadores.patchValue({
  idSprIndicador: obj.idSprIndicador,
  idSprObjetivo: obj.idSprObjetivo,
  idSprEquipoGerencial: obj.idSprResponsable,
  idSprEquipoGerencialAnterior: obj.idSprEquipoGerencial,
  idSprParticipanteElemento: obj.idSprParticipanteElemento,
  nombre: obj.nombre,
  descripcion: obj.descripcion,
  unidadInformacion: obj.unidadInformacion,
  fechaInicio: obj.fechaInicio,
  estado: obj.estado,
});
this.modal.open(this.nameModal);
}


  //Detalle Proceso

onSubmit(){
  this.submitted = true;
  this.formObjetivoIndicadores.value.usuario = this.currentUser.idSprUsuario;
  this.formObjetivoIndicadores.value.ip = this.ipAddress;
  this.formObjetivoIndicadores.value.idSprResponsable = this.formObjetivoIndicadores.value.idSprEquipoGerencial;
  this.formObjetivoIndicadores.value.nombre = this.formObjetivoIndicadores.value.nombre.toUpperCase();
  //this.formObjetivoIndicadores.value.idSprResponsable = 9;
console.log('Data guardar: ',this.formObjetivoIndicadores.value );
  if (!this.formObjetivoIndicadores.invalid) {
    if (this.formObjetivoIndicadores.value.idSprIndicador == null) {
      this.indicadorService.create(this.formObjetivoIndicadores.value).subscribe(
        (resp) => {
          ///this.initApp();
          this.initObjetivoIndicadores();
          this.closeModalConfiguracion();
          this.alert.createOk();
          this.initApp();
        },
        (err) => {
          this.alert.createError();
        }
      );
    } else {
      this.indicadorService.update(this.formObjetivoIndicadores.value).subscribe(
        (resp) => {
          this.initObjetivoIndicadores();
          this.closeModalConfiguracion();
          this.alert.updateOk();
          this.initApp();
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
  this.formObjetivoIndicadores.reset();
}

openModal(row:any) {
  this.onResetForm();
  this.setFormObjetivo(row.idSprObjetivo);
  this.modal.open(this.nameModal);
}

openModal1() {
  this.onResetForm();
  this.modal.open(this.nameModal1);
}

closeModalConfiguracion(){

  this.modal.closeId('objetivo-modalNewEdit');
  }
}

