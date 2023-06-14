import { Component, Input, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ProyectoService } from '../../../services/proyecto.service';
import { IndicadoresService } from '../../../services/indicadores.service';
import { ModalService } from '../../../../../services/modal.service';
import { AlertService } from '../../../../../services/alert.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-indicadores-proyectos',
  templateUrl: './indicadores-proyectos.component.html',
  styleUrls: ['./indicadores-proyectos.component.css']
})
export class IndicadoresProyectosComponent {
  public formProyectoIndicadores: UntypedFormGroup;
  public submitted = false;
  public dataProyectoIndicadores: any = [];
  public dataProyecto: any = [];
  public dataIndicadores: any = [];
  private idDeleteRegister: number = 0;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer:string;
  public nameModal: string = 'proyecto-modalNewEdit'
  public nameApp = 'Proyectos Indicadores....';
  public selectItems:any = [];
  private idSprAmbiente:number =0;
  
  @Input() set init(proyecto:any) {
    this.initApp(proyecto); 
   }
  
  constructor(
    public modal:ModalService,
    private indicadorService:IndicadoresService,
    private ip: IpPublicService,
    private alert: AlertService,
    private fb: FormBuilder,
    private proyectoService:ProyectoService,
    ) {
      this.buffer = localStorage.getItem('currentUser');
      this.currentUser = JSON.parse(this.buffer);
      this.selectItems = [
        { value: '', label: 'Selecione..' },
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Inactivo' },
      ];
      this.idSprAmbiente = this.currentUser.idSprAmbiente;
      console.log('CONSTRUCTIR PROYECTOS: ' );
  }

  initApp(data:string = 'proyecto'){
    if(data == 'proyecto'){
      this.initProyectoIndicadores();
}
   
  }

  initProyectoIndicadores(){
    this.proyectoService.list(`?idSprAmbiente=${this.idSprAmbiente}`).subscribe((resp) => {
      this.dataProyecto = resp;
      console.log('Proyecto***: ', this.dataProyecto );
      this.getIndicadoresProyecto();
    });
  }

  getIndicadoresProyecto() {
    this.indicadorService.list().subscribe((resp) => {
      this.dataIndicadores = resp;
      console.log('Indicadores-pro: ', this.dataIndicadores);
    this.mapingDataProyectosInidicadores();
    });
  }

  mapingDataProyectosInidicadores(){
    this.dataProyectoIndicadores =[]
    let indiceUno=0; let dataProyect: any = [];  
    for (let i = 0; i < this.dataProyecto.length; i++){
      for (let j = 0; j < this.dataIndicadores.length; j++){
        if (this.dataProyecto[i].idSprProyecto ==this.dataIndicadores[j].idSprProyecto) {
          dataProyect.push({    
            idSprIndicador: this.dataIndicadores[j].idSprIndicador,
            nombre: this.dataIndicadores[j].nombre,       
            descripcion: this.dataIndicadores[j].descripcion,       
            fechaInicio: this.dataIndicadores[j].fechaInicio,       
            unidadInformacion: this.dataIndicadores[j].unidadInformacion,       
            estado: this.dataIndicadores[j].estado,       
            idSprProyecto: this.dataProyecto[i].idSprProyecto,       
          });indiceUno++;     
          }}
        this.dataProyectoIndicadores.push({
          nombreProyecto: this.dataProyecto[i].nombreProyecto,
          idSprProyecto: this.dataProyecto[i].idSprProyecto,
          indicadores:dataProyect
        }); dataProyect = [];

      }
  }

  get appForm() {
    return this.formProyectoIndicadores.controls;
  }

  ngOnInit(): void {
    this.getIpPublic();
    this.setFormProyecto();
    console.log('NG ONINIT PROYECTO ' );
  }
  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  setFormProyecto(idSprProyecto:string=" "){
    this.formProyectoIndicadores = this.fb.group({
      idSprProyecto: [idSprProyecto],
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
    this.setFormProyecto(row.idSprProyecto);
    this.modal.open(this.nameModal);
  }

  delete(row: any) {  
    console.log('Delete select...: ', row.idSprIndicador );  
    this.idDeleteRegister = row.idSprIndicador;
    this.modal.open('delete-procyecto');
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
this.setFormProyecto(obj.idSprProyecto)
this.formProyectoIndicadores.patchValue({
  idSprProyecto: obj.idSprProyecto,
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
  this.formProyectoIndicadores.value.usuario = this.currentUser.idSprUsuario;
  this.formProyectoIndicadores.value.ip = this.ipAddress;
  this.formProyectoIndicadores.value.nombre = this.formProyectoIndicadores.value.nombre.toUpperCase();
  this.formProyectoIndicadores.value.idSprResponsable = 9;
  if (!this.formProyectoIndicadores.invalid) {
    if (this.formProyectoIndicadores.value.idSprIndicador == null) {
      this.indicadorService.create(this.formProyectoIndicadores.value).subscribe(
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
      this.indicadorService.update(this.formProyectoIndicadores.value).subscribe(
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
  this.formProyectoIndicadores.reset();
}


}
