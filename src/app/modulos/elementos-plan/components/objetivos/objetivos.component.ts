import { Objetivos } from '../../models/objetivos';
import { ObjetivoService } from '../../services/objetivo.service';
import { IpPublicService } from '../../../../services/ip-public.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, FormArray, FormControl } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject, mergeMap } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AtribucionService } from '../../services/atribucion.service';
import { AtribucionObjetivoService } from '../../services/atribucion-objetivo.service';
import { EspecialUnoService } from 'src/app/modulos/catalogos-proces/services/especial-uno.service';
import { AmbienteService } from 'src/app/modulos/catalogos-admin/services/ambiente.service';
import { EstrategiaObjetivoService } from '../../services/estrategia-objetivo.service';
import { EstrategiasService } from '../../services/estrategias.service';
import { ConstantsCatalogosIdService } from '../../../../services/constants-catalogos-id.service';
import { PlanInstitucionalService } from './../../../catalogos-admin/services/plan-institucional.service';
import { PlanAniosService } from './../../../catalogos-admin/services/plan-anios.service';
import { AniosObjetivosService } from './../../../catalogos-admin/services/anios-objetivos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.css']
})
export class ObjetivosComponent implements OnInit, OnDestroy {
  breadCrumbItems = [{ label: 'Formulación' }, { label: 'Planes' }, { label: 'Objetivos', active: true }];
  public formObjetivo!: UntypedFormGroup;
  public formSelectAnio!: UntypedFormGroup;
  //public formSubmitted = false;
  public submitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataApp: any[] = [];
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameModal: string = 'modalNewEdit'
  public nameModalGestion: string = 'modalNewEdit2'
  nameAppModal = 'Crea-edita Objetivos';
  public nombreUnidad!: any;
  public dataObjetivo!: any; // trae data de objetivos del Ambiente
  public dataCatEspecialEnfoque!: any;// trae data catalogo Especial Uno Enfoque
  public dataCatEspecialPerspectiva!: any; // trae data catalogo  Especial Uno perspectiva
  public dataAtribucion!: any; //data para Atribucion
  public dataAtribucionesChecked: any = []; //data para Atribucion
  public dataAtribucionesProcess: any = []; //data para Atribucion
  public dataAtribucionMap!: any;
  public dataAtribucionObjetivo: any = [];//data relacionada de Objetivo-Atribucion
  public dataEstrategiasObjetivos: any = [];//
  public dataEstrategias: any = [];//
  public idSprAmbiente!: number;
  public idRecursivoEnfoque: number = 0;
  public idRecursivoPerspectiva: number = 0;
  public idSprNivelN1: number = 0; //validacion (de nivel n1)
  public nivelSelect!: number
  public dataAtribucionObjMapeada!: any;
  public dataAmbiente!: any;
  public dataObjetivoMain!: any;
  public dataEstrategiaObjetivoMain: any = [];
  public dataPlanInstitucional: any = [];
  public dataAniosObjetivos: any = [];
  public dataAniosObj: any = [];
  public dataAnios: any = [];
  public d: any = [];
  public mostrarModalAlineacion: boolean = false;
  public objetivo!: any;
  public idObjetivoSeleccionado: number = 0;
  public idSprPlanInsAnio: number = 0;
  public objetivoNombre: string = '';
  public idSprSelectAnio: number = 0;
  anioActual:string ='';
  hoy = new Date();
  pipe = new DatePipe('en-US');


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private objetivosService: ObjetivoService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService,
    public atribucionService: AtribucionService,
    public atribucionObjetivoService: AtribucionObjetivoService,
    public catalogoEspecialUnoService: EspecialUnoService,
    private ambienteService: AmbienteService,
    private estrategiasObjetivosService: EstrategiaObjetivoService,
    private estrategiasService: EstrategiasService,
    private planInstService: PlanInstitucionalService,
    private aniosService: PlanAniosService,
    private aniosObjService: AniosObjetivosService,
  ) {
    this.anioActual = this.pipe.transform(this.hoy, 'YYYY'); 

    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.nombreUnidad = this.currentUser.nombreUnidad;
    this.idSprAmbiente = this.currentUser.idSprAmbiente;

  //######## IDS DE CATALOGOS #################
  this.idRecursivoEnfoque = ConstantsCatalogosIdService.ID_COMUNES_ENFOQUE;
  this.idRecursivoPerspectiva = ConstantsCatalogosIdService.ID_COMUNES_ENFOQUE;
  this.idSprNivelN1 = ConstantsCatalogosIdService.ID_COMUNES_NIVEL_1;

    this.selectItems = [
      { value: '', label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];


  }

  get objetivoForm() {
    return this.formObjetivo.controls;
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
    this.formObjetivo = this.fb.group({
      idSprAtribucionObjetivo: [],
      idSprAtribucion: new FormArray([]),
      idSprObjetivo: [],
      idSprAmbiente: [],
      idSprPlanInsAnio: [],
      idSprAnio: ['', Validators.required],
      idSprAnioAnterior: [],
      nombre: ['', Validators.required],
      descripcion: [],
      idSprEnfoque: [''],
      idSprPerspectiva: [''],
      idSprEstrategia: [],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.nivelSelect = this.currentUser.idSprNivel
    this.getIpPublic();
    this.initApp();
    this.listAmbiente(this.idSprAmbiente);
  }

  initApp() {
    this.listObjetivo();
    this.listCatEnfoque();
    this.listCatPerspectiva();
    this.setDataTable();
    this.setForm();
    this.getDataAnios();
    this. setSelectAnioForm();
    
  }
  setSelectAnioForm(){
    this.formSelectAnio = this.fb.group({
      idSprAnioSelected: [this.idSprSelectAnio]
    });
  }
  changeAnioSelected(e:any){
    this.getDataAniosObj(e.target.value)
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


  getDataAnios(){
       this.aniosService.list()
    .subscribe(resp => {
      this.dataAnios = resp;
       this.setAnioSelect();
    });}
  
  setAnioSelect(){
    for (let i = 0; i < this.dataAnios.length; i++) {
      if(this.dataAnios[i].anio == this.anioActual){
        this.idSprSelectAnio = this.dataAnios[i].idSprAnio;
      }}
    this.setSelectAnioForm();
    this.getDataAniosObj(this.idSprSelectAnio);}
  
  getDataAniosObj(idSprAnio:any){
    this.aniosObjService.list('?idSprAnio=' + idSprAnio )
 .subscribe(resp => {
   this.dataAniosObj = resp;  
   this.listObjetivo2();
 });}
  listObjetivo2() {
    this.objetivosService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataObjetivo = resp;
        this.setMapeoAniosObjetivos();
      });
  }



  setMapeoAniosObjetivos(){
    let objetivos:any =[];
    let dataProcess: any = [];
    let atribucionObjetivo: any = [];
    let estrategiaObjetivo: any = [];
    for (let a = 0; a < this.dataAnios.length; a++) {
    for (let b = 0; b < this.dataAniosObj.length; b++) {
      if (this.dataAnios[a].idSprAnio == this.dataAniosObj[b].idSprAnio) {     
        for (let i = 0; i < this.dataObjetivo .length; i++) {
          if (this.dataAniosObj[b].idSprObjetivo == this.dataObjetivo[i].idSprObjetivo) {                    
      // Atribuciones-objetivos
      for (let j = 0; j < this.dataAtribucionObjetivo.length; j++) {
        if ((this.dataObjetivo[i].idSprObjetivo == this.dataAtribucionObjetivo[j].idSprObjetivo)) {
          for (let k = 0; k < this.dataAtribucion.length; k++) {
            if (this.dataAtribucion[k].idSprAtribucion == this.dataAtribucionObjetivo[j].idSprAtribucion) {
              atribucionObjetivo.push({
                idSprAtribucion: this.dataAtribucion[k].idSprAtribucion,
                nombre: this.dataAtribucion[k].nombre,
              });
            }
          }
        }
      }
      // Estrategias-objetivos
      for (let m = 0; m < this.dataEstrategiasObjetivos.length; m++) {
        if ((this.dataObjetivo[i].idSprObjetivo == this.dataEstrategiasObjetivos[m].idSprObjetivo)) {
          for (let n = 0; n < this.dataEstrategias.length; n++) {
            if (this.dataEstrategias[n].idSprEstrategia == this.dataEstrategiasObjetivos[m].idSprEstrategia && this.dataEstrategiasObjetivos[m].nivelSuperior == 'N') {
              estrategiaObjetivo.push({
                idSprEstrategia: this.dataEstrategias[n].idSprEstrategia,
                nombre: this.dataEstrategias[n].nombre,
              });
            }
          }
        }
      }
      dataProcess.push({   
        idSprObjetivo: this.dataObjetivo[i].idSprObjetivo,
        anio: this.dataAnios[a].anio,
        idSprAmbiente: this.dataObjetivo[i].idSprAmbiente,
        descripcion: this.dataObjetivo[i].descripcion,
        idSprEnfoque: this.dataObjetivo[i].idSprEnfoque,
        idSprPerspectiva: this.dataObjetivo[i].idSprPerspectiva,
        fechaInicio: this.dataObjetivo[i].fechaInicio,
        fechaFin: this.dataObjetivo[i].fechaFin,
        nombre: this.dataObjetivo[i].nombre,
        estado: this.dataObjetivo[i].estado,
        atribuciones: atribucionObjetivo,
        estrategias: estrategiaObjetivo,
        idSprPlanInsAnio: this.dataAniosObj[b].idSprPlanInsAnio,
        idSprAnio: this.dataAniosObj[b].idSprAnio,   
        nroEstrategias: ((estrategiaObjetivo.length > 0) ? estrategiaObjetivo.length : 0),
        nroAtribuciones: ((atribucionObjetivo.length > 0) ? atribucionObjetivo.length : 0)
      });
      atribucionObjetivo = [];
      estrategiaObjetivo = [];

          }

  }//Fin for objetivos
  this.d = dataProcess;
    //console.log("Mapeado d: ", this.d); 
}
}

}

//console.log("Objetivos------: ", objetivos);
}

  getEstrategias() {
    this.objetivo = { name: 'estrategia', idSprObjetivo: this.idObjetivoSeleccionado, objetivoNombre: this.objetivoNombre }
  }
  getEstrategiasSuperior() {
    this.objetivo = { name: 'estrategia-sup', idSprObjetivo: this.idObjetivoSeleccionado, objetivoNombre: this.objetivoNombre  }
  }


  listObjetivo() {
    this.objetivosService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(resp => {
        this.dataObjetivo = resp;
        this.listAtribucion()
      });
    return true;
  }

  listAtribucion() {
    this.atribucionService.list('?idSprAmbiente=' + this.idSprAmbiente)
      .subscribe(respuestaService => {
        this.dataAtribucion = respuestaService;
        console.log("List Atribucion:", this.dataAtribucion);
        this.getDataAtribucionObjetivo();
        this.setDataAtribucionesChecked();
      });
  }

  getDataAtribucionObjetivo() {
    this.atribucionObjetivoService.list()
      .subscribe((resp) => {
        this.dataAtribucionObjetivo = resp;
        this.getDatEstrategiasObjetivo();
      });
  }
  getDatEstrategiasObjetivo() {
    this.estrategiasObjetivosService.list()
      .subscribe((resp) => {
        this.dataEstrategiasObjetivos = resp;
        this.getDataEstrategias();
      });
  }
  getDataEstrategias() {
    this.estrategiasService.list()
      .subscribe((resp) => {
        this.dataEstrategias = resp;
        this.getDataAniosObjetivos();
      });
  }

  getDataAniosObjetivos() {
    this.aniosObjService.list()
      .subscribe((resp) => {
        this.dataAniosObjetivos = resp;
        console.log('Anios-objetivos: ', this.dataAniosObjetivos );
        this.mapeoAtribucionObjetivo();
      });
  }


  //mapeo atribucion objetivo
  mapeoAtribucionObjetivo() {
    let dataProcess: any = [];
    let atribucionObjetivo: any = [];
    let estrategiaObjetivo: any = [];
    let idSprPlanInsAnio: number = 0;
    let idSprAnio: number = 0;
    
    
    
    for (let i = 0; i < this.dataObjetivo.length; i++) {
      // Atribuciones-objetivos
      for (let j = 0; j < this.dataAtribucionObjetivo.length; j++) {
        if ((this.dataObjetivo[i].idSprObjetivo == this.dataAtribucionObjetivo[j].idSprObjetivo)) {
          for (let k = 0; k < this.dataAtribucion.length; k++) {

            if (this.dataAtribucion[k].idSprAtribucion == this.dataAtribucionObjetivo[j].idSprAtribucion) {
              atribucionObjetivo.push({
                idSprAtribucion: this.dataAtribucion[k].idSprAtribucion,
                nombre: this.dataAtribucion[k].nombre,
              });
            }
          }
        }
      }
      // Anio-Objetivo
      for (let z = 0; z < this.dataAniosObjetivos.length; z++) {
        if ((this.dataObjetivo[i].idSprObjetivo == this.dataAniosObjetivos[z].idSprObjetivo)) {                       
                idSprPlanInsAnio = this.dataAniosObjetivos[z].idSprPlanInsAnio;             
                idSprAnio = this.dataAniosObjetivos[z].idSprAnio               ;
        }
      }
      // Estrategias-objetivos
      for (let m = 0; m < this.dataEstrategiasObjetivos.length; m++) {
        if ((this.dataObjetivo[i].idSprObjetivo == this.dataEstrategiasObjetivos[m].idSprObjetivo)) {
          for (let n = 0; n < this.dataEstrategias.length; n++) {
            if (this.dataEstrategias[n].idSprEstrategia == this.dataEstrategiasObjetivos[m].idSprEstrategia && this.dataEstrategiasObjetivos[m].nivelSuperior == 'N') {
              estrategiaObjetivo.push({
                idSprEstrategia: this.dataEstrategias[n].idSprEstrategia,
                nombre: this.dataEstrategias[n].nombre,
              });
            }
          }
        }
      }
      dataProcess.push({
        idSprObjetivo: this.dataObjetivo[i].idSprObjetivo,
        idSprAmbiente: this.dataObjetivo[i].idSprAmbiente,
        descripcion: this.dataObjetivo[i].descripcion,
        idSprEnfoque: this.dataObjetivo[i].idSprEnfoque,
        idSprPerspectiva: this.dataObjetivo[i].idSprPerspectiva,
        fechaInicio: this.dataObjetivo[i].fechaInicio,
        fechaFin: this.dataObjetivo[i].fechaFin,
        nombre: this.dataObjetivo[i].nombre,
        estado: this.dataObjetivo[i].estado,
        atribuciones: atribucionObjetivo,
        estrategias: estrategiaObjetivo,
        idSprPlanInsAnio: idSprPlanInsAnio,
        idSprAnio: idSprAnio,   
        nroEstrategias: ((estrategiaObjetivo.length > 0) ? estrategiaObjetivo.length : 0),
        nroAtribuciones: ((atribucionObjetivo.length > 0) ? atribucionObjetivo.length : 0)
      });
      atribucionObjetivo = [];
      estrategiaObjetivo = [];
      idSprPlanInsAnio = 0;
      idSprAnio = 0;
    }
    this.dataAtribucionObjMapeada = dataProcess;
    console.log("Mapeado atribucion-Objetivo-estrategia-anios: ", this.dataAtribucionObjMapeada);
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

  setDataAtribucionesChecked() {
    let atribucionesFixed = this.dataAtribucion;
    let checked: boolean = false;
    for (let i = 0; i < this.dataAtribucion.length; i++) {
      for (let j = 0; j < this.dataAtribucionesChecked.length; j++) {
        if (this.dataAtribucion[i].idSprAtribucion == this.dataAtribucionesChecked[j].idSprAtribucion) {
          checked = true;
        }
      }
      atribucionesFixed[i].checked = checked;
      checked = false;
    }
    this.dataAtribucionesProcess = atribucionesFixed;
    //console.log('Arreglo html checked: ', this.dataAtribucionesProcess);
  }

  onSubmit():boolean {
    //console.log('Insertar: ',this.formObjetivo.value );
    let idSprObjetivo = this.formObjetivo.value.idSprObjetivo;
    let idSprUsuario = this.currentUser.idSprUsuario;
    if (this.formObjetivo.value.fechaInicio > this.formObjetivo.value.fechaFin) {// lavidacion de fechas
      this.alert.fechaError();
      return false;
    }
    this.submitted = true;
    this.formObjetivo.value.idSprAmbiente = this.currentUser.idSprAmbiente;
    this.formObjetivo.value.usuario = this.currentUser.idSprUsuario;
    this.formObjetivo.value.ip = this.ipAddress;
    if (this.formObjetivo.valid) {
      if (this.formObjetivo.value.idSprObjetivo == null || this.formObjetivo.value.idSprObjetivo == " "){
        let arregloAtribuciones = this.formObjetivo.value.idSprAtribucion;
        //console.log("despues de insertar objetivo", arregloAtribuciones)
        //console.log('Objetivo grabar nuevo : ', this.formObjetivo.value);
        this.objetivosService.create(this.formObjetivo.value).subscribe({
            next: (dataResponseObjetivo) =>{
                              this.aniosObjService.create({
                                              idSprAnio:this.formObjetivo.value.idSprAnio, 
                                              idSprObjetivo:dataResponseObjetivo.idSprObjetivo,
                                              usuario: this.currentUser.idSprUsuario,
                                              ip: this.ipAddress,
                                              estado: "1"
                                            }).subscribe({
                                              next:(dataInsertPlanAnio)=>{
                                                  console.log('Año-objetivo Ok.' );
                                                           // for recorre inserciones atribuciones
                                                for (let elemento of arregloAtribuciones) {
                                                  let dataAtribuciones = {
                                                    idSprObjetivo: dataResponseObjetivo.idSprObjetivo,
                                                    idSprAtribucion: elemento,
                                                    usuario: this.currentUser.idSprUsuario,
                                                    ip: this.ipAddress,
                                                    estado: "1"
                                                  }
                                                  // Inserta N atribuciones
                                                  this.atribucionObjetivoService.create(dataAtribuciones).subscribe({
                                                    next: (data) =>{
                                                      console.log("Atribucion insertada: ", data)
                                                    },
                                                    error:(error)=>{
                                                      console.log("Ocurrió un error al insertar atribucion..")
                                                    }            
                                                  });
                                                }
                                              },
                                              error:(error)=>{
                                                let objetivo = {
                                                  idSprObjetivo: dataResponseObjetivo.idSprObjetivo,
                                                  ip: this.ipAddress,
                                                  usuario: this.currentUser.idSprUsuario,
                                                  delLog: "S",
                                                }
                                                this.objetivosService.update(objetivo).subscribe({
                                                  next: (response)=>{
                                                    console.log('Rollback Objetivo ' );
                                                  },
                                                  error:(response)=>{
                                                    console.log('Error Rollback Objetivo ' );
                                                  }
                                                })
                                                console.log('Año-objetivo error.' );
                                              }
                                            })
            this.initApp();
            this.modal.close();
            this.alert.createOk();
            return true;
          },
          error: (err) => {
            this.alert.createError();
          }
        });



      } else {
        //Actualizar/modificar
        //console.log('Actualizar: ', this.formObjetivo.value );
        let insertarNuevo: boolean = true;
        let idsAtribucionesObjetivosActuales;
        this.atribucionObjetivoService.list(`?idSprObjetivo=${this.formObjetivo.value.idSprObjetivo}`).subscribe(data => {
          idsAtribucionesObjetivosActuales = data;
          let idsAtribucionesDeFormulario = this.formObjetivo.value.idSprAtribucion;
          this.formObjetivo.value.ip = this.ipAddress;
          this.formObjetivo.value.usuario = this.currentUser.idSprUsuario;

          // Actualizacion a la tabla objetivos
          this.objetivosService.update(this.formObjetivo.value).subscribe({
            next: (data)=>{

              // Si anios son diferentes
              if(this.formObjetivo.value.idSprAnio != this.formObjetivo.value.idSprAnioAnterior){
                if(this.formObjetivo.value.idSprAnioAnterior > 0){                  
                      let anioObjetivo = {
                        idSprPlanInsAnio: this.formObjetivo.value.idSprPlanInsAnio,
                        ip: this.ipAddress,
                        usuario: this.currentUser.idSprUsuario,
                        delLog: "S"}
                        //console.log('Data insert anio-Obj: ', anioObjetivo );
                      this.aniosObjService.update(anioObjetivo).subscribe({
                            next: (data) =>{
                              console.log('Desabilitado anterior ok: ', );
                            },
                            error:(response)=>{
                              console.log('Desabilitado anterior Error: ', );
                              insertarNuevo = false;
                            }
                      });
                  }
                      this.aniosObjService.create({
                        idSprAnio:this.formObjetivo.value.idSprAnio, 
                        idSprObjetivo:this.formObjetivo.value.idSprObjetivo,
                        usuario: this.currentUser.idSprUsuario,
                        ip: this.ipAddress,
                        estado: "1"
                      }).subscribe({
                        next:(dataInsertPlanAnio)=>{

                        },
                        error:(err)=>{
                          insertarNuevo = false;
                        }
                      });
            }

           
            if (idsAtribucionesDeFormulario.length >= idsAtribucionesObjetivosActuales.length) {
              for (let i = 0; i < idsAtribucionesDeFormulario.length; i++) {
                for (let j = 0; j < idsAtribucionesObjetivosActuales.length; j++) {
                  if (idsAtribucionesObjetivosActuales[j].idSprAtribucion == idsAtribucionesDeFormulario[i] && idsAtribucionesObjetivosActuales[j].estado == 1) {
                    // Si existe el sprAtribucionObjetivo
                    insertarNuevo = false;
                  }
                }
                if (insertarNuevo) {
                  let dataAtribucionObjetivoCreate = {
                    idSprObjetivo: idSprObjetivo,
                    idSprAtribucion: idsAtribucionesDeFormulario[i],
                    usuario: idSprUsuario, ip: this.ipAddress, estado: 1
                  }
                  this.atribucionObjetivoService.create(dataAtribucionObjetivoCreate).subscribe(response => {
                    insertarNuevo = false;
                    console.log('Atribucion-obj nuevo: ', response);
                  })
                } else {
                  insertarNuevo = true;
                }
              }// Fin for
              this.initApp();this.modal.close();this.alert.updateOk();
            } else {
              console.log('Delete: ');
              console.log('De Db: ', idsAtribucionesObjetivosActuales);
              let deleteConfirm: boolean = false;
              //let codicion:boolean = false;
              for (let j = 0; j < idsAtribucionesObjetivosActuales.length; j++) {
                for (let i = 0; i < idsAtribucionesDeFormulario.length; i++) {
                  console.log("Borrrar: ", idsAtribucionesObjetivosActuales[j].idSprAtribucion ,"=>", idsAtribucionesDeFormulario[i], " = ", deleteConfirm);

                  if (idsAtribucionesObjetivosActuales[j].idSprAtribucion == idsAtribucionesDeFormulario[i]) {
                    deleteConfirm = true;
                  }}
                  if (!deleteConfirm){
                    let dataAtribucionObjetivoCreate = {
                      idSprAtribucionObjetivo: idsAtribucionesObjetivosActuales[j].idSprAtribucionObjetivo,
                      delLog: 'S',usuario: idSprUsuario, ip: this.ipAddress, estado: 1
                    }
                    this.atribucionObjetivoService.update(dataAtribucionObjetivoCreate).subscribe(response => {
                      deleteConfirm = false;
                      //console.log('Atribucion-obj eliminado: ', response);
                    })
                  } else{
                    deleteConfirm = false;
                  }
              }
              this.initApp();
              this.modal.close();
              this.alert.updateOk();
            }



          },
          error:(err)=>{

          }
          });// Fn update obj
        },
          (err) => {
            this.alert.createError();
          }

        );
      }
      return false;
    } else {
      console.log("formulario invalido")
      return false;
    }
  }

  edit(obj: any) {
    this.onResetForm(),
      this.openModal();
    this.dataAtribucionesChecked = obj.atribuciones;
    this.setDataAtribucionesChecked();
    this.addItemChecked(obj.atribuciones);
    console.log(':::: ', obj);
    this.formObjetivo.patchValue({
      idSprObjetivo: obj.idSprObjetivo,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      idSprEnfoque: obj.idSprEnfoque,
      idSprAnio: obj.idSprAnio,
      idSprPlanInsAnio: obj.idSprPlanInsAnio,
      idSprAnioAnterior: obj.idSprAnio,
      idSprPerspectiva: obj.idSprPerspectiva,
      idSprAtribucionObjetivo: obj.idSprAtribucionObjetivo,
      idSprEstrategia: obj.estrat,
      fechaInicio: obj.fechaInicio,
      fechaFin: obj.fechaFin,
      estado: obj.estado,
    });
  }

  gestionObjetivosEstrategias(row: any) {
    console.log('Editando: ', row);
    this.idObjetivoSeleccionado = row.idSprObjetivo
    this.objetivoNombre = row.nombre
    this.openModalGestion();
  }

  delete(row: any) {
    this.idDeleteRegister = row.idSprObjetivo;
    this.idSprPlanInsAnio = row.idSprPlanInsAnio;
    this.modal.open('del');
  }

  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      let objetivo = {
        idSprObjetivo: this.idDeleteRegister,
        ip: this.ipAddress,
        usuario: this.currentUser.idSprUsuario,
        delLog: "S",
      }
      this.objetivosService.update(objetivo).subscribe({
        next: (data) =>{
          let anioObjetivo = {
            idSprPlanInsAnio: this.idSprPlanInsAnio,
            ip: this.ipAddress,
            usuario: this.currentUser.idSprUsuario,
            delLog: "S",
          }
                this.aniosObjService.update(anioObjetivo).subscribe({
                  next: (data) =>{
                    for (let i = 0; i < this.dataAtribucionObjetivo.length; i++) {
                      if (objetivo.idSprObjetivo == this.dataAtribucionObjetivo[i].idSprObjetivo) {
                        let atribucionObjetivo = {
                          idSprAtribucionObjetivo: this.dataAtribucionObjetivo[i].idSprAtribucionObjetivo,
                          ip: this.ipAddress,
                          delLog: "S",
                        }
                        this.atribucionObjetivoService.update(atribucionObjetivo).subscribe(data => {
                            console.log("Actualiza", data)            
                          });
                      }
                    }// Fin for
                  },
                  error:(err)=>{

                  }
                });
          this.initApp();
          this.modal.close();
          //this.formObjetivo.value.nombre = "";
          this.alert.createOk();
        },
        error:(err) => {
          this.alert.createError();
          this.modal.close();
        }
    });
    }
  }

  listCatEnfoque() {
    this.catalogoEspecialUnoService.list()
      .subscribe(resp => {
        this.dataCatEspecialEnfoque = this.getDataDependite(resp, this.idRecursivoEnfoque);
      })
    return true;
  }
  listCatPerspectiva() {
    this.catalogoEspecialUnoService.list()
      .subscribe(resp => {
        this.dataCatEspecialPerspectiva = this.getDataDependite(resp, this.idRecursivoPerspectiva);
      })
    return true;
  }

  getDataDependite(dataObj: any, spr_idSprEspecialUno: any = null) {
    let perspectiva: any = [];
    dataObj.forEach((row: any) => {
      if (row.spr_idSprEspecialUno == spr_idSprEspecialUno) {
        perspectiva.push(
          {
            idSprEspecialUno: row.idSprEspecialUno,
            nombre: row.nombre,
            descripcion: row.descripcion,
            ponderacion: row.ponderacion,
            spr_idSprEspecialUno: row.spr_idSprEspecialUno,
            estado: row.estado,
          });
      }
    });
    return perspectiva;
  }

  /************INICIO METODOS PARA ATRIBUCIONES-OBJETIVOS *************/
  onChange(event: any) { //boton chekbox
    const idSprAtribucion = (this.formObjetivo.controls['idSprAtribucion'] as FormArray);
    if (event.target.checked) {
      idSprAtribucion.push(new FormControl(event.target.value));
      console.log(event.target.value)
    } else {
      const index = idSprAtribucion.controls
        .findIndex(x => x.value === event.target.value);
      idSprAtribucion.removeAt(index);
    }
    console.log('Arreglo Checked: ', this.formObjetivo.value.idSprAtribucion);
  }


  addItemChecked(arreglo: any) {
    //vaciar el arreglo
    const idsSprAtribucion: FormArray = this.formObjetivo.get('idSprAtribucion') as FormArray;
    idsSprAtribucion.removeAt(null);
    //Agregando items para editar
    for (let i = 0; i < arreglo.length; i++) {
      const idSprAtribucion: FormArray = this.formObjetivo.get('idSprAtribucion') as FormArray;
      idSprAtribucion.push(new FormControl(arreglo[i].idSprAtribucion + " "));
    }
    console.log('Arreglo Checked: ', this.formObjetivo.value.idSprAtribucion);

  }


  listObjeAtribucionUpdate(atribucionObjetivo: any) {//actulizar  objetivos
    const idSprAtribucion = (this.formObjetivo.controls['idSprAtribucion'] as FormArray);
    for (let elemento of this.dataAtribucionObjetivo) {
      if (elemento.idSprObjetivo == atribucionObjetivo) {
        idSprAtribucion.push(new FormControl(elemento.idSprAtribucion));
        const checkbox = document.getElementById(elemento.idSprAtribucion,) as HTMLInputElement | null;
        if (checkbox != null) {
          checkbox.checked = true;
        }
      }
    }
    return idSprAtribucion;
  }
  /**************FIN METODOS PARA ATRIBUCIONES-OBJETIVOS *************/


  /**************INICIO METODOS PARA ESTRATEGIAS-OBJETIVOS *************/


  listAmbiente(idSprAmbiente: number) {
    console.log('idSprAmbiente', idSprAmbiente)
    this.ambienteService.list('/' + idSprAmbiente)
      .subscribe(resp => {
        this.dataAmbiente = resp;
        console.log('listAmbiente', this.dataAmbiente)
        this.listObjetivoMain();
      })

  }
  listObjetivoMain() { //nivel superior
    this.objetivosService.list('?idSprAmbiente=' + this.dataAmbiente.spr_idSprAmbiente)
      .subscribe((resp) => {
        this.dataObjetivoMain = resp;
      });
    console.log('listAmbiente', this.dataObjetivoMain)
  }
  listEstrategiaObjetivoMain() {// consulta para el nivel superior
    for (let elemento of this.dataObjetivoMain) {
      this.estrategiasObjetivosService.list('?idSprObjetivo=' + elemento.idSprObjetivo)
        .subscribe((resp) => {
          this.dataEstrategiaObjetivoMain = resp;
          let estrategiasobj1 = this.listEstrategiaNombre();
          elemento.estrategias = estrategiasobj1;
        });
    }
    return this.dataObjetivoMain;
  }
  listEstrategiaNombre() {//nivel superir
    let estrategiasobj1 = [{}];
    let x = 0;
    for (let elemento of this.dataEstrategiaObjetivoMain) {
      this.estrategiasService.list('/' + elemento.idSprEstrategia).subscribe((resp) => {
        estrategiasobj1[x] = {
          "idSprEstrategia": resp.idSprEstrategia,
          "nombre": resp.nombre
        };
        x = x + 1;
      });
    }
    x = 0;
    return estrategiasobj1
  }

  mostrarAlineacionEstrategia(obj: any) {
    this.listEstrategiaObjetivoMain();
    console.log("Objetivo mi Ambiente: ", this.dataObjetivoMain);
    this.mostrarModalAlineacion = true;
    console.log("Objetivo", obj)

  }

  /**************FIN METODOS PARA ESTRATEGIAS-OBJETIVOS *************/

  openModalNew() {
    this.dataAtribucionesChecked = [];
    this.setDataAtribucionesChecked();
    this.openModal();
  }

  openModal() {
    this.onResetForm();
    this.modal.open(this.nameModal);
  }

  openModalGestion() {
    this.getEstrategias();
    this.getEstrategiasSuperior();
    //this.onResetForm();
    this.modal.open(this.nameModalGestion);
  }

  onResetForm() {
    console.log('Resetear form objetivos: ');
    this.submitted = false;
    this.formObjetivo.reset();
  }
}
