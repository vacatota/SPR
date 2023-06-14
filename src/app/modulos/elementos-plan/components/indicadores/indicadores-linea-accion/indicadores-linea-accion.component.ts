import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LineaAccionService } from '../../../services/linea-accion.service';
import { ModalService } from '../../../../../services/modal.service';
import { AlertService } from '../../../../../services/alert.service';
import { IndicadoresService } from '../../../services/indicadores.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EstrategiaObjetivoService } from '../../../services/estrategia-objetivo.service';
import { ObjetivoService } from '../../../services/objetivo.service';
import { EstrategiasService } from '../../../services/estrategias.service';
import { ComunService } from 'src/app/modulos/catalogos-proces/services/comun.service';
import { EquipoGerencialService } from 'src/app/modulos/catalogos-proces/services/equipo.gerencial.service';
import { ParticipanteElementoService } from '../../../services/participante.elemento.service';
import { ConfiguracionIndicadores } from '../../../models/configuracionIndicadores';

@Component({
  selector: 'app-indicadores-linea-accion',
  templateUrl: './indicadores-linea-accion.component.html',
  styleUrls: ['./indicadores-linea-accion.component.css']
})
export class IndicadoresLineaAccionComponent {
  public formLineaAccionIndicadores: UntypedFormGroup;
  public submitted = false;
  public dataLineaAccionIndicadores: any = [];
  public dataLineaAccion: any = [];
  public dataObjetivo!: any;// trae data de objetivos
  public dataEstrategiaObjetivo: any = [];// trae data catalogo comun tipo de proyecto
  public dataEquipoGerencial!: any;
  public dataParticipanteElem!: any;
  public idTipoParticipante: number = 271;
  public dataTipoParticipante!: any;
  public dataIndicadoresLineas: any = [];
  public dataEstrategias: any = [];
  public dataTipoParticpacion: any = [];
  public dataElementosParticpantes: any = [];
  private idDeleteRegister: number = 0;
  private currentUser!: any;
  public dataIndicadores: any[] = [];
  private ipAddress!: string;
  private buffer!: any;
  public nameModal: string = 'lineaAccion-modalNewEdit'
  public nameApp = 'Indicadores-Línea acción';
  public selectItems: any = [];
  public dataResponsableProceso: any = [];
  public nameModalAdverso: string = 'modalNewEdit1'
  public configuracionIndicadores= [];
   public descripcionIndicador !: any;
  private idSprAmbiente: number = 0;
  tipoParticipante = 293;

  @Input() set init2(lineaAccion: any) {
    this.initApp(lineaAccion);
  }

  constructor(
    public modal: ModalService,
    private indicadorService: IndicadoresService,
    private ip: IpPublicService,
    private alert: AlertService,
    private fb: FormBuilder,
    private lineaAccionService: LineaAccionService,
    private estrategiaObjetivosService: EstrategiaObjetivoService,
    private objetivoService: ObjetivoService,
    private estrategiasService: EstrategiasService,
    private comunService: ComunService,
    private equipoGerencialService: EquipoGerencialService,
    private participanteElementoService: ParticipanteElementoService,
  ) {

    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.selectItems = [
      { value: '', label: 'Selecione..' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];
    this.idSprAmbiente = this.currentUser.idSprAmbiente;
    console.log('AMBIENTE: ', this.idSprAmbiente);
    console.log('CONSTRUCTOR LINEA DE ACCION: ');

  }


  initApp(data: string = '') {
    if (data == 'lineaAccion') {
      console.log('Iniciando linea-accion: ', data);
      //this.initLineaAccionIndicadores();
      //this.getLineaAccionObjetivo();
      this.initObjetivoIndicadores();
      this.listEquipoGerencial();

    }
    this.getDataIndicadores()
  }


  initObjetivoIndicadores(){
   this.objetivoService.list(`?idSprAmbiente= ${this.idSprAmbiente}`).subscribe((resp) => {
     this.dataObjetivo = resp;
     console.log('OBJETIVOS: ', this.dataObjetivo );
     this.getDataEstrategiasObjetivos();

   });
 }

getDataEstrategiasObjetivos(){
   this.estrategiaObjetivosService.list().subscribe((resp) => {
     this.dataEstrategiaObjetivo = resp;
     console.log('estrategias-objetivos: ', this.dataEstrategiaObjetivo );
     this.getDataEstrategias();

   });
 }

 getDataEstrategias(){
   this.estrategiasService.list().subscribe((resp) => {
     this.dataEstrategias = resp;
     console.log('estrategias: ', this.dataEstrategias );
     this.getDataLineaAccion();

   });
 }

 getDataLineaAccion(){
   this.lineaAccionService.list().subscribe((resp) => {
     this.dataLineaAccion = resp;
     console.log('Lineas acion: ', this.dataLineaAccion );
     this.getDataIndicadores();
   });
 }

 getDataIndicadores(){
  this.indicadorService.list().subscribe((resp) => {
    this.dataIndicadores = resp;
    console.log('Indicadores: ', this.dataIndicadores );
    this.listEquipoGerencial(),
        this.mapeoLineasAccionIndicadores();
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
  for (let i = 0; i < this.dataIndicadoresLineas.length; i++) {
    for (let j = 0; j < this.dataElementosParticpantes.length; j++) {
      if (this.dataIndicadoresLineas[i].idSprIndicador === this.dataElementosParticpantes[j].idSprIndicador) {
        for (let k = 0; k < this.dataEquipoGerencial.length; k++) {
          if (this.dataElementosParticpantes[j].idSprEquipoGerencial === this.dataEquipoGerencial[k].idSprEquipoGerencial) {
            this.dataIndicadoresLineas[i].gradoNombres = this.dataEquipoGerencial[k].gradoNombres;
            this.dataIndicadoresLineas[i].idSprEquipoGerencial = this.dataElementosParticpantes[j].idSprEquipoGerencial;
            this.dataIndicadoresLineas[i].idSprParticipanteElemento = this.dataElementosParticpantes[j].idSprParticipanteElemento;
          }
        }
      }
    }
  }
  //this.dataResponsableProceso = dataProcess;
  console.log('Data procesos-particip: ', this.dataIndicadoresLineas);

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

   mapeoLineasAccionIndicadores() {
   let dataProcess: any = [];
   let dataIndicador: any = [];
   for (let i = 0; i < this.dataObjetivo.length; i++) {
     for (let j = 0; j < this.dataEstrategiaObjetivo.length; j++) {
       if ((this.dataObjetivo[i].idSprObjetivo == this.dataEstrategiaObjetivo[j].idSprObjetivo)) {

         for (let l = 0; l < this.dataEstrategias.length; l++) {
           if (this.dataEstrategiaObjetivo[j].idSprEstrategia == this.dataEstrategias[l].idSprEstrategia && this.dataEstrategiaObjetivo[j].nivelSuperior == 'N') {

         for (let k = 0; k < this.dataLineaAccion.length; k++) {
           if (this.dataLineaAccion[k].idSprEstrategia == this.dataEstrategias[l].idSprEstrategia){

            for (let m = 0; m < this.dataIndicadores.length; m++) {
              if (this.dataIndicadores[m].idSprLineaAccion == this.dataLineaAccion[k].idSprLineaAccion){

                dataIndicador.push({
                  idSprIndicador:this.dataIndicadores[m].idSprIndicador,
                  idSprLineaAccion:this.dataIndicadores[m].idSprLineaAccion,
                  nombre:this.dataIndicadores[m].nombre,
                  descripcion:this.dataIndicadores[m].descripcion,
                  unidadInformacion:this.dataIndicadores[m].unidadInformacion,
                  fechaInicio:this.dataIndicadores[m].fechaInicio,
                  estado:this.dataIndicadores[m].estado,
                  idSprResponsable:this.dataIndicadores[m].idSprResponsable
                      })
           }
          }
             dataProcess.push({
               idSprLineaAccion: this.dataLineaAccion[k].idSprLineaAccion,
               nombre: this.dataLineaAccion[k].nombre,
               descripcion: this.dataLineaAccion[k].descripcion,
               alcance: this.dataLineaAccion[k].alcance,
               localidadImpacto: this.dataLineaAccion[k].localidadImpacto,
               justificacion: this.dataLineaAccion[k].justificacion,
               fechaInicio: this.dataLineaAccion[k].fechaInicio,
               fechaFin: this.dataLineaAccion[k].fechaFin,
               indicadores:dataIndicador
             });
             dataIndicador = [];

           }
         }
       }

       }
       }
     }
   }
   console.log("Mapeado lineas accion: ", dataProcess);
   this.dataIndicadoresLineas = dataProcess;
 }

 /////////////TRAE DATOS TIPO PARTICIPANTE///////////
 listTipoParticipante(){
  this.comunService.list().subscribe(resp =>{
    this.dataTipoParticipante = this.getDataDependiente(resp, this.idTipoParticipante);

    console.log('tipo participante: ', this.dataTipoParticipante);
  })
}
 //////////////DEPENDIENTE DEL CATALOGO COMUN///////////////////////////////
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


 get appForm() {
    return this.formLineaAccionIndicadores.controls;
  }

  ngOnInit(): void {
    this.getIpPublic();
    this.setFormLineaAccion();
    }

  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  setFormLineaAccion(idSprLineaAccion: string = " ") {
    this.formLineaAccionIndicadores = this.fb.group({
      idSprLineaAccion: [idSprLineaAccion],
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
    this.modal.open('delete-lineaAccion');
  }

  confirmDelete() {
    console.log('Delete confirm...: ');
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
  this.openModalAdverso();
  }

  edit(obj: any) {
    this.onResetForm();
    console.log('Editar: ', obj);
    this.setFormLineaAccion(obj.idSprLineaAccion)
    this.formLineaAccionIndicadores.patchValue({
      idSprLineaAccion: obj.idSprLineaAccion,
      idSprIndicador: obj.idSprIndicador,
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


  onSubmit() {
      this.submitted = true;
    this.formLineaAccionIndicadores.value.usuario = this.currentUser.idSprUsuario;
    this.formLineaAccionIndicadores.value.ip = this.ipAddress;
    this.formLineaAccionIndicadores.value.idSprResponsable = this.formLineaAccionIndicadores.value.idSprEquipoGerencial;
    this.formLineaAccionIndicadores.value.nombre = this.formLineaAccionIndicadores.value.nombre.toUpperCase();
       console.log("Daata guardar: ", this.formLineaAccionIndicadores.value);
    if (!this.formLineaAccionIndicadores.invalid) {
      if (this.formLineaAccionIndicadores.value.idSprIndicador == null) {
        this.indicadorService.create(this.formLineaAccionIndicadores.value).subscribe(
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
        this.indicadorService.update(this.formLineaAccionIndicadores.value).subscribe(
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


  onResetForm() {
    this.submitted = false;
    this.formLineaAccionIndicadores.reset();
  }

  openModal(row: any) {
    this.onResetForm();
    this.setFormLineaAccion(row.idSprLineaAccion);
    this.modal.open(this.nameModal);
  }
  openModalAdverso() {
    this.onResetForm();
    this.modal.open(this.nameModalAdverso);
  }

  closeModalConfiguracion(){

    this.modal.closeId('objetivo-modalNewEdit');
    }

}
