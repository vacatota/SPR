import { Component, Input } from '@angular/core';
import { ObjetivoService } from '../../../services/objetivo.service';
import { EstrategiaObjetivoService } from '../../../services/estrategia-objetivo.service';
import { EstrategiasService } from '../../../services/estrategias.service';
import { ModalService } from './../../../../../services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { AlertService } from 'src/app/services/alert.service';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-objetivos-estrategias',
  templateUrl: './objetivos-estrategias.component.html',
  styleUrls: ['./objetivos-estrategias.component.css']
})
export class ObjetivosEstrategiasComponent {
  private dataObjetivos: any [];
  public formEstrategias: FormGroup;
  public formSubmitted = false;
  public submitted:boolean = false;
  private dataEstrategias: any [];
  private dataEstrategiaObjetivo: any [];
  public dataEstrategiasMain: any [];
  public selectItems: any [];
  public nameModal: string ='Modal-objetivos-estrategias';
  public nameApp: string = 'Objetivos-estrategias' ;
  public idSprObjetivoSelected:number = 0;
  public nombreObjetivoSelected:string ='';
  public buffer:string;
public currentUser:any
public idSprAmbiente:number = 0;
public idDeleteRegister:number = 0;
public idSprUsuario:number =0;
public idSprEstrategiaObjetivo:number =0;
private ipAddress:string ="0";

  @Input() set msgEstrategia(data:any) {
    this.initApp(data);
   }

initApp(data:any){
  if(data.name == 'estrategia'){
   this.getDataObjetivo(data.idSprObjetivo);
   this.getIpPublic();
  }
}
getIpPublic() {
  this.ip.getIPAddress().subscribe((res: any) => {
    this.ipAddress = res.ip;
  });
}
get EstrategiasForm() {
  return this.formEstrategias.controls;
}

constructor(
  private objetivoService:ObjetivoService,
  private estrategiaObjetivoService:EstrategiaObjetivoService,
  private estrategiaService:EstrategiasService,
  public modal:ModalService,
  private estrategiasService: EstrategiasService,
    private alert: AlertService,
    private ip: IpPublicService,
    private fb: FormBuilder,


){
  this.getIpPublic();
  this.buffer = localStorage.getItem('currentUser');
  this.currentUser = JSON.parse(this.buffer);
  this.idSprUsuario = this.currentUser.idSprUsuario;
  this.idSprAmbiente = this.currentUser.idSprAmbiente;

  this.formEstrategias = this.fb.group({
    idSprEstrategiaObjetivo: ["",[]],
    idSprEstrategia: [,[]],
    idSprObjetivo: [,[]],
    nombre: ['', [Validators.required]],
    estado: ['', [Validators.required]],
    nivelActual: [],

  });


  this.selectItems = [
    { value: '', label: 'Seleccione' },
    { value: 1, label: 'Activo' },
    { value: 2, label: 'Inactivo' },
  ];
}

onSubmit(){
   this.formEstrategias.value.usuario = this.currentUser.idSprUsuario;
  this.formEstrategias.value.ip = this.ipAddress;
  this.formEstrategias.value.idSprObjetivo = this.idSprObjetivoSelected;
  this.formEstrategias.value.nombre = this.formEstrategias.value.nombre.toUpperCase();
  this.formEstrategias.value.idSprAmbiente = this.currentUser.idSprAmbiente;
  this.submitted = true;
  if (!this.formEstrategias.invalid) {
    if (this.formEstrategias.value.idSprEstrategia == null || this.formEstrategias.value.idSprEstrategia == "") {
      this.formEstrategias.value.delLog = 'N';
      let estrategia = {
        nombre: this.formEstrategias.value.nombre,
        estado: this.formEstrategias.value.estado,
        ip: this.ipAddress,
        usuario: this.currentUser.idSprUsuario,
      }

       let idSprEstrategiaUltimo: any;
        this.estrategiasService.create(estrategia).pipe(
         mergeMap((estrategiaGuardada) => {
           idSprEstrategiaUltimo = estrategiaGuardada.idSprEstrategia
           this.formEstrategias.value.nivelSuperior = 'N'
           this.formEstrategias.value.idSprEstrategia = estrategiaGuardada.idSprEstrategia
           return this.estrategiaObjetivoService.create(this.formEstrategias.value)
      }))
        .subscribe(data => {
        this.getDataObjetivo(this.idSprObjetivoSelected);
        this.alert.createOk();
        this.closeModalEstrategias();
      }, (err) => {
        this.alert.createError();
        let estrategiaObjetivo = {
          idSprEstrategia: idSprEstrategiaUltimo,
          delLog: "S",
        }
        this.estrategiasService.update(estrategiaObjetivo).subscribe();
        console.log('Error al crear la relacion estategia-objetivo: ', estrategiaObjetivo);
        //this.modal.close();
      });
    } else {
        this.formEstrategias.value.idSprEstrategia;
         this.formEstrategias.value.nombre;
         this.formEstrategias.value.estado;
         this.formEstrategias.value.ip = this.ipAddress;
         this.formEstrategias.value.usuario = this.currentUser.idSprUsuario,
        this.estrategiasService.update(this.formEstrategias.value).subscribe(resp => {
          this.getDataObjetivo(this.idSprObjetivoSelected);
          this.closeModalEstrategias();
          this.alert.updateOk();
        }, (err) => {
          this.alert.updateError();
        })
    }
  } else {
    return;
  }

}

getDataObjetivo(idSprObjetivo: number) {
  this.objetivoService.list('/' + idSprObjetivo)
    .subscribe(respuestaService => {
      this.dataObjetivos = [respuestaService];
      console.log("Objetivos: ", this.dataObjetivos)
      this.getDataEstrategiaObjetivo();
    })
}
getDataEstrategiaObjetivo() {
  this.estrategiaObjetivoService.list()
    .subscribe((resp) => {
      this.dataEstrategiaObjetivo = resp;
      console.log('Estrategia-objetivo: ', this.dataEstrategiaObjetivo);
     this.listEstrategia();

    });
}

listEstrategia() {
  this.estrategiaService.list().subscribe((resp) => {
    this.dataEstrategias = resp;
    console.log("Estrategias: ", this.dataEstrategias)
    this.mapeoEstrategiaObjetivo();
  });
}

mapeoEstrategiaObjetivo() {
  let dataProcess: any = [];
  for (let i = 0; i < this.dataObjetivos.length; i++) {
    for (let j = 0; j < this.dataEstrategiaObjetivo.length; j++) {
      if ((this.dataObjetivos[i].idSprObjetivo == this.dataEstrategiaObjetivo[j].idSprObjetivo) && (this.dataEstrategiaObjetivo[j].nivelSuperior == 'N')  ) {
        for (let k = 0; k < this.dataEstrategias.length; k++) {
          if (this.dataEstrategias[k].idSprEstrategia == this.dataEstrategiaObjetivo[j].idSprEstrategia
          ) {
            dataProcess.push({
              idSprEstrategia: this.dataEstrategias[k].idSprEstrategia,
              idSprObjetivo: this.dataObjetivos[i].idSprObjetivo,
              idSprEstrategiaObjetivo: this.dataEstrategiaObjetivo[j].idSprEstrategiaObjetivo,
              objetivo: this.dataObjetivos[i].nombre,
              estrategia: this.dataEstrategias[k].nombre,
              estado: this.dataEstrategias[k].estado,
            });
          }
        }
      }
    }
  }
  this.dataEstrategiasMain = dataProcess;
  //console.log('mapeado: ', this.dataEstrategiasMain);
}


openModal() {
  this.onResetForm();
  this.modal.open(this.nameModal);
}
edit(row:any){
  this.modal.open(this.nameModal);
  this.formEstrategias.patchValue({
    idSprEstrategia: row.idSprEstrategia,
    idSprEstrategiaObjetivo: row.idSprEstrategiaObjetivo,
    nombre: row.estrategia,
    estado: row.estado,
  });
}
delete(row: any) {
  this.idDeleteRegister = row.idSprEstrategia;
  this.idSprEstrategiaObjetivo = row.idSprEstrategiaObjetivo;
  this.modal.open('delete-estrategia');
}

confirmDelete() {
  if (this.idDeleteRegister > 0) {
    this.estrategiaService.update({
      "idSprEstrategia": this.idDeleteRegister,
      "usuario": this.currentUser.idSprUsuario,
      "delLog": "S",
      "ip": this.ipAddress
    }).subscribe(resp => {
      let data ={idSprEstrategiaObjetivo: this.idSprEstrategiaObjetivo,delLog:'S',usuario: this.currentUser.idSprUsuario,ip: this.ipAddress}

      return this.estrategiaObjetivoService.update(data)
      .subscribe(resp => {
        this.getDataObjetivo(this.idSprObjetivoSelected);
        this.alert.deleteOk();
        this.modal.closeId('delete-estrategia')

      });



    }, (err) => {
      this.alert.deleteError();
      this.modal.close();
    });
  }
}

mostrarDetalle(row:any){}


closeModalEstrategias(){
this.modal.closeId(this.nameModal)
}
onResetForm(){
  this.submitted = false;
  this.formEstrategias.reset();
}
}
