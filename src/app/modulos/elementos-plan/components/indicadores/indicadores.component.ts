import { ObjetivoService } from '../../services/objetivo.service';
import { ProyectoService} from '../../services/proyecto.service';
import { ProcesoService} from './../../services/proceso.service';
import { EstrategiaObjetivoService} from './../../services/estrategia-objetivo.service';
import { LineaAccionService} from './../../services/linea-accion.service';
import { PlanAccionService} from './../../services/plan.accion.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { IndicadoresService } from '../../services/indicadores.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { EstrategiasService } from '../../services/estrategias.service';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  //styleUrls: ['./indicadores.component.css']
})
export class IndicadoresComponent  {
  breadCrumbItems = [{label: 'Formulación'}, {label: 'Planes'}, {label: 'Indicadores', active: true}];
 
  public formApp: UntypedFormGroup;
  public formIndicadoresObjetivos: UntypedFormGroup;
  public submitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataIndicadores: any[] = [];
  public dataObjetivo: any[] = [];
  public dataProyectos: any[] = [];
  public dataProcesos: any[] = [];
  public dataObjetivoIndicadores: any = [];
  public dataProyectoIndicadores: any = [];
  public dataEstrategiasObjetivos: any = [];
  public dataLineasAccionIndicadores: any = [];
  public dataPlanAccionIndicadores: any = [];
  public dataProcesosIndicadores: any = [];
  public dataLineaAccion: any = [];
  public dataEstrategias: any = [];
  private idDeleteRegister: number = 0;
  public idSprAmbiente:number;
  public selectItems: any[] = [];
  public pestanias: any[] = [];
  public nameModal: string = 'modalNewEdit'
  public dataProcess:any[];
  public nameApp = 'Indicadores';
  public showObjetivos:string ='';
  public showProyectos:string ='';
  public showProcesos:string ='';

  public activeObjetivos:string = '';
  public activeProyectos:string = '';

  public proceso:string = '';
  public lineAction:string = '';
  public planAccion:string = '';
  public proyecto:string = '';
  public objetivo:string = '';



constructor(
    private fb: FormBuilder,
    private objetivos:ObjetivoService,
    private proyectos:ProyectoService,
    private procesos:ProcesoService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService,
    private indicadoreServices:IndicadoresService,
    private ruta: Router, private location: Location,
    private estrategiaObjectService: EstrategiaObjetivoService,
    private estrategiasService:EstrategiasService,
    private lineaAccionService:LineaAccionService,
    private planAccionService:PlanAccionService
){
 /*  this.buffer = localStorage.getItem('currentUser');
  this.currentUser = JSON.parse(this.buffer);
  this.selectItems = [
    { value: '', label: '.' },
    { value: 1, label: 'Activo' },
    { value: 2, label: 'Inactivo' },
  ];

  this.idSprAmbiente = this.currentUser.idSprAmbiente;  */
}



openObjetivos(){
   this.objetivo='objetivo';
   this.lineAction ='';
}
openLineasAccion(){
  console.log("lineaAccion")
  this.lineAction='lineaAccion'
  console.log("xxxxx: ",this.lineAction)
}
openPlanesAccion(){
  this.planAccion='planAccion'
  console.log("plan de accion",this.planAccion)
}
openProyectos(){
  this.lineAction ='';
  this.proyecto ='proyecto';
}                                 

openProcesos(){
  this.proceso ='proceso';
}


ngOnInit(): void {
  //this.getIpPublic();
  this.openObjetivos();
}
/* getIpPublic() {
  this.ip.getIPAddress().subscribe((res: any) => {
    this.ipAddress = res.ip;
  });
}

ngOnDestroy(): void {
  // Do not forget to unsubscribe the event
  this.dtTrigger.unsubscribe();
} */

/* initApp(){ 
    this.setDataTable();
this.setFormObjetivos();
 
  } */

/* initProcessIndicators(){
  this.procesosService.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
    this.dataProcesos = resp;
    console.log('Procesos: ', this.dataProcesos );
    this.getIndicatorsProcess();
  });
}

getIndicatorsProcess() {
  this.indicadoreServices.list().subscribe((resp) => {
    this.dataIndicadores = resp;
    console.log('Indicadores-pro: ', this.dataIndicadores);
  this.mapingDataProcesosInidicadores();
  });
} */
/*
mapingDataProcesosInidicadores(){
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

       this.dataProcesosIndicadores.data= this.dataProcesosIndicadores;
      this.dataProcesosIndicadores.dataProcesos= this.dataProcesos; 
      console.log('Procesos-indicadores: ', this.dataProcesosIndicadores);
    }
}
*/
 /*  initLineActionObjects(){
    this.showProcesos= 'show active';
    this.objetivos.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
      this.dataObjetivos = resp;
      console.log('Objet: ', this.dataObjetivos );
      this.getOjectsEstrategy();
    });

  }

  getOjectsEstrategy() {
    this.estrategiaObjectService.list().subscribe((resp) => {
      this.dataEstrategiasObjetivos = resp;
      console.log('Obj-estrategy: ', this.dataEstrategiasObjetivos );
      this.getEstrategy();
    });
  }

  getEstrategy() {
    this.estrategiasService.list().subscribe((resp) => {
      this.dataEstrategias = resp;
      console.log('Estrategy: ', this.dataEstrategias );
      this.getLineAction();
    });
  }

  getLineAction() {
    this.lineaAccionService.list().subscribe((resp) => {
      this.dataLineaAccion = resp;
      console.log('Lineas accion: ', this.dataLineaAccion );
      this.getIndicators();
    });
  }

  getIndicators() {
    this.indicadoreServices.list().subscribe((resp) => {
      this.dataIndicadores = resp;
      console.log('Indicadores: ', this.dataIndicadores);
    this.mapingDataLineasAccionInidicadores();
    });
  }


  mapingDataLineasAccionInidicadores(){
    let indiceUno=0; let dataProcess: any = [];
    for (let i = 0; i < this.dataObjetivos.length; i++){
      for (let j = 0; j < this.dataEstrategiasObjetivos.length; j++){
        if (this.dataObjetivos[i].idSprObjetivo ==this.dataEstrategiasObjetivos[j].idSprObjetivo) {
          for (let k = 0; k < this.dataEstrategias.length; k++){
            if ((this.dataEstrategias[k].idSprEstrategia == this.dataEstrategiasObjetivos[j].idSprEstrategia) && (this.dataEstrategiasObjetivos[j].nivelSuperior == 'N') ) {
              for (let n = 0; n < this.dataLineaAccion.length; n++){
                for (let m = 0; m < this.dataIndicadores.length; m++){
                  if (this.dataLineaAccion[n].idSprLineaAccion == this.dataIndicadores[m].idSprLineaAccion) {
                    dataProcess.push({
                      idSprIndicador: this.dataIndicadores[m].idSprIndicador,
                      nombre: this.dataIndicadores[m].nombre,
                      descripcion: this.dataIndicadores[m].descripcion,
                      fechaInicio: this.dataIndicadores[m].fechaInicio,
                      unidadInformacion: this.dataIndicadores[m].unidadInformacion,
                      estado: this.dataIndicadores[m].estado,
                      idSprLineaAccion: this.dataLineaAccion[n].idSprLineaAccion,
                    });indiceUno++;
                  }
                }
                this.dataLineasAccionIndicadores.push({
                  nombre: this.dataLineaAccion[n].nombre,
                  idSprLineaAccion: this.dataLineaAccion[n].idSprLineaAccion,
                  indicadores:dataProcess
                });
                dataProcess = [];
              }
            }
          }
        }
      }
    }
    //console.log('LineasAccion-indicators: ', this.dataLineasAccionIndicadores);
  } */

/* 
  setFormObjetivos(idSprObjetivo:string=" "){
    this.formIndicadoresObjetivos = this.fb.group({
      idSprObjetivo: [idSprObjetivo],
      idSprIndicador: [],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      unidadInformacion: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
  }

  get appForm() {
    return this.formIndicadoresObjetivos.controls;
  }




setFatherSelect(idSprSelected:number){
  this.formIndicadoresObjetivos = this.fb.group({
    idSprObjetivo: [idSprSelected],
  });
}


  getLineasAccion(){
    this.objetivos.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
      this.dataObjetivos = resp;
      console.log('Objetivos: ', this.dataObjetivos );
      //this.getDataIndicadores();
    });
  }

  getDataProcesos(){
      this.procesos.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
        this.dataProcesos = resp;
        console.log('Procesos: ',this.dataProcesos );

        //this.getDataProjects();
      });
    } */

 /*    initProject(){
      this.getDataProjects();
  } */
/*
    getDataProjects(){
        this.proyectos.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
          this.dataProyectos = resp;
          console.log('Proyectos: ', this.dataProyectos );
          this. getDataProjectsIndicators();
        });
      }
      getDataIndicadores(){
        this.indicadores.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
          this.dataIndicadores = resp;
          console.log('Indicadores: ', this.dataIndicadores);
          //this.reDrawDataTable();
        console.log('Data XXXXXXXXXXX: ',  this.mapeoDataObjetivosEstrategias());
        });
      }

public dataProcess:any[];
mapeoDataObjetivosEstrategias(){
  let indiceUno=0;
  let dataProcess: any = [];

  let dato:any;
  let obj:any


  for (let i = 0; i < this.dataObjetivos.length; i++){
    for (let j = 0; j < this.dataIndicadores.length; j++){
      if (this.dataObjetivos[i].idSprObjetivo ==this.dataIndicadores[j].idSprObjetivo) {
        console.log('Ingresó: ', this.dataObjetivos[i].idSprObjetivo + "-- " + this.dataIndicadores[j].idSprObjetivo);
        obj = this.dataObjetivos[i].nombre;
        dataProcess.push({
          idSprIndicador: this.dataIndicadores[j].idSprIndicador,
          indicador: this.dataIndicadores[j].nombre
        });
            indiceUno++;
        }
      }
      this.dataMain.push({
        objetivo: this.dataObjetivos[i].nombre,
        idSprObjetivo: this.dataObjetivos[i].idSprObjetivo,
        indicadores:dataProcess
      })
      dataProcess = [];
    }
    console.log("Data mapeado: ", dataProcess)
    console.log("Data main: ", this.dataMain)
    //this.dataAmbientesRoles = dataProcess;
    return true;
}

      getDataProjectsIndicators(){
        this.indicadoreServices.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
          this.dataIndicadores = resp;
          //console.log('Projects-Indicadores: ', this.dataIndicadores);
        this.mapingDataProjectsIndicators();
        });
      }

      mapingDataProjectsIndicators(){
        let indiceUno=0; let dataProcess: any = [];
        for (let i = 0; i < this.dataProyectos.length; i++){
          for (let j = 0; j < this.dataIndicadores.length; j++){
            if (this.dataProyectos[i].idSprProyecto ==this.dataIndicadores[j].idSprProyecto) {
              dataProcess.push({
                idSprIndicador: this.dataIndicadores[j].idSprIndicador,
                nombre: this.dataIndicadores[j].nombre,
                descripcion: this.dataIndicadores[j].descripcion,
                fechaInicio: this.dataIndicadores[j].fechaInicio,
                unidadInformacion: this.dataIndicadores[j].unidadInformacion,
                estado: this.dataIndicadores[j].estado,
                idSprProyecto: this.dataProyectos[i].idSprProyecto,
              });indiceUno++;
              }
            }
            this.dataProyectosIndicadores.push({
              proyecto: this.dataProyectos[i].nombreProyecto,
              idSprProyecto: this.dataProyectos[i].idSprProyecto,
              indicadores:dataProcess
            }); dataProcess = [];
          }
          this.reDrawDataTable();
          console.log('Projects-indicators: ', this.dataProyectosIndicadores);
          //return true;
          /* this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

            dtInstance.destroy();

            this.dtTrigger.next(null);
          });
        }
       */
/*
        getObjetivos(){
          this.objetivos.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
           this.dataObjetivos = resp;
           console.log('Objetivos: ', this.dataObjetivos );
           this.getDataObjetivosIndicadores();
         });
       }
        getDataObjetivosIndicadores(){
          this.indicadoreServices.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
            this.dataIndicadores = resp;
            console.log('Indicadores: ', this.dataIndicadores);
            //this.reDrawDataTable();
          this.mapeoDataObjetivosIndicadores();
          });
        }

mapeoDataObjetivosIndicadores(){
  let indiceUno=0; let dataProcess: any = [];
  for (let i = 0; i < this.dataObjetivos.length; i++){
    for (let j = 0; j < this.dataIndicadores.length; j++){
      if (this.dataObjetivos[i].idSprObjetivo ==this.dataIndicadores[j].idSprObjetivo) {
        dataProcess.push({
          idSprIndicador: this.dataIndicadores[j].idSprIndicador,
          nombre: this.dataIndicadores[j].nombre,
          descripcion: this.dataIndicadores[j].descripcion,
          fechaInicio: this.dataIndicadores[j].fechaInicio,
          unidadInformacion: this.dataIndicadores[j].unidadInformacion,
          estado: this.dataIndicadores[j].estado,
          idSprObjetivo: this.dataObjetivos[i].idSprObjetivo,
        });indiceUno++;
        }}
      this.dataObjetivosIndicadores.push({
        objetivo: this.dataObjetivos[i].nombre,
        idSprObjetivo: this.dataObjetivos[i].idSprObjetivo,
        indicadores:dataProcess
      }); dataProcess = [];
      console.log('Objetivos-inidcadores: ', this.dataObjetivosIndicadores);
    }
    this.reDrawDataTable();
    //return true;
}
*/

/*   reDrawDataTable(){
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


openModal(row:any) {
  this.setFormObjetivos(row.idSprObjetivo);
  this.modal.open(this.nameModal);
} */


/*   onSubmit() {
    this.submitted = true;
    this.formIndicadoresObjetivos.value.usuario = this.currentUser.idSprUsuario;
    this.formIndicadoresObjetivos.value.ip = this.ipAddress;
    this.formIndicadoresObjetivos.value.nombre = this.formIndicadoresObjetivos.value.nombre.toUpperCase();
    this.formIndicadoresObjetivos.value.fechaInicio = "2023-01-01 00:00:00";
    //console.log('grabar/EDITAR: ', this.formIndicadoresObjetivos.value);
    if (!this.formIndicadoresObjetivos.invalid) {
      //console.log('Data save: ', this.formIndicadoresObjetivos.value);
      if (this.formIndicadoresObjetivos.value.idSprIndicador == null) {
        this.indicadoreServices.create(this.formIndicadoresObjetivos.value).subscribe(
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
        this.indicadoreServices.update(this.formIndicadoresObjetivos.value).subscribe(
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
  } */

/* 
  delete(id: number) {    
    this.idDeleteRegister = id;
    this.modal.open('del');
  }

  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.indicadoreServices.update({
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
console.log('Editar: ', obj );
this.formIndicadoresObjetivos.patchValue({
  idSprIndicador: obj.idSprIndicador,
  idSprObjetivo: obj.idSprObjetivo,
  nombre: obj.nombre,
  descripcion: obj.descripcion,
  unidadInformacion: obj.unidadInformacion,
  fechaInicio: obj.fechaInicio,
  estado: obj.estado,
});
this.modal.open(this.nameModal);
} */

}
