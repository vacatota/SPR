
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, FormArray, FormControl } from '@angular/forms';
import { ObjetivoService } from '../../../services/objetivo.service';
import { AmbienteService } from 'src/app/modulos/catalogos-admin/services/ambiente.service';
import { EstrategiaObjetivoService } from '../../../services/estrategia-objetivo.service';
import { EstrategiasService } from '../../../services/estrategias.service';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-objetivos-estrategias-superior',
  templateUrl: './objetivos-estrategias-superior.component.html',
  styleUrls: ['./objetivos-estrategias-superior.component.css']
})
export class ObjetivosEstrategiasSuperiorComponent {

  public submitted = false;
  public formObjetivo!: UntypedFormGroup;
  public formEstrategia!: UntypedFormGroup;
  public desripcionObjetivo!: any;
  public idSprObjetivoA!: any;
  public dataObjetivoMain!: any;
  public dataAmbiente!: any;
  public dataEstrategiaObjetivoMain: any = [];
  private ipAddress!:string;
  public idSprAmbiente!: number;
  private currentUser!: any;
  private buffer!: any;
  public nombreUnidad!: any;

  @Input() set msgEstrategiaSup(data:any) {
    this.getIpPublic();
    this.initApp(data); 
   } 

   constructor(
    private fb: FormBuilder,
    private objetivosService: ObjetivoService,
    private ambienteService: AmbienteService,
    private alert: AlertService,
    private ip: IpPublicService,    
    private estrategiaObjetivoService: EstrategiaObjetivoService,
    private estrategiasService: EstrategiasService,
  ){
    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.nombreUnidad = this.currentUser.nombreUnidad;
    this.idSprAmbiente = this.currentUser.idSprAmbiente;
  }

  get EstrategiasForm() {
    return this.formEstrategia.controls;
  }

   initApp(data:any){
  
    if(data.name == 'estrategia-sup'){
      console.log('name: ', data.name,'Id: ', data.idSprObjetivo );
      this.listAmbiente(this.idSprAmbiente);
  }
  this.idSprObjetivoA=data.idSprObjetivo;
  this.setFormAlineacionEs();
  }
  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

setForm() {
  this.formObjetivo = this.fb.group({
    idSprAtribucionObjetivo: [],
    idSprAtribucion: new FormArray([]),
    idSprObjetivo: [],
    idSprAmbiente: [],
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

setFormAlineacionEs() {
  this.formEstrategia = this.fb.group({
    idSprEstrategiaObjetivo: [],
    //idSprEstrategia: [],
    idSprEstrategia: new FormArray([]),
    nivelSuperior: "S",
  });
}

listAmbiente(idSprAmbiente: number) {
  console.log('idSprAmbiente', idSprAmbiente)
  this.ambienteService.list('/' + idSprAmbiente)
    .subscribe(resp => {
      this.dataAmbiente = resp;
      this.listObjetivoMain();
    })

}
listObjetivoMain() { //nivel superior 
  this.objetivosService.list('?idSprAmbiente=' + this.dataAmbiente.spr_idSprAmbiente)
    .subscribe((resp) => {
      this.dataObjetivoMain = resp;
      this.listEstrategiaObjetivoMain()
    });
}
/*mostrarAlineacionEstrategia(obj: any) {
  console.log("data OBJ: ", obj);
  console.log("Objetivo mi Ambiente: ", this.dataObjetivoMain);
  this.listEstrategiaObjetivoMain();
  console.log("Objetivo mi Ambiente: ", this.dataObjetivoMain);

}*/

listEstrategiaObjetivoMain() {// consulta para el nivel superior
  for (let elemento of this.dataObjetivoMain) {
    this.estrategiaObjetivoService.list('?idSprObjetivo=' + elemento.idSprObjetivo)
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

onChangeEstrategia(event: any) { //boton chekbox 
  console.log('preuba',event.target.value)
  const idSprEstrategia = (this.formEstrategia.controls['idSprEstrategia'] as FormArray);
  console.log('preuba',event.target.value)
  if (event.target.checked) {
    idSprEstrategia.push(new FormControl(event.target.value));
    console.log(event.target.value)
  } else {
    const index = idSprEstrategia.controls
      .findIndex(x => x.value === event.target.value);
    idSprEstrategia.removeAt(index);
  }
}
onSubmitEstrategia() {
  this.submitted = true;
  this.formEstrategia.value.usuario = this.currentUser.idSprUsuario;
  this.formEstrategia.value.ip = this.ipAddress;
  if (this.formEstrategia.value.idSprAtribucionObjetivo == null) {
    let estrategia = this.formEstrategia.value.idSprEstrategia;

    for (let elemento of estrategia) {
      console.log('id arreglo: ', elemento);
      let dataAtribuciones = {
        idSprObjetivo: this.idSprObjetivoA,
        idSprEstrategia: elemento,
        nivelSuperior: this.formEstrategia.value.nivelSuperior,
        usuario: this.currentUser.idSprUsuario,
        ip: this.ipAddress,
        estado: "1"
      }
      console.log('id arreglo: ', dataAtribuciones);
      this.estrategiaObjetivoService.create(dataAtribuciones).subscribe(
        (resp) => {
          // this.initApp();
          //this.modal.close();
          this.alert.createOk();
        },
        (err) => {
          this.alert.createError();
        }
      );
    }


  } else {
    this.estrategiaObjetivoService.update(this.formEstrategia.value).subscribe(
      (resp) => {
        //this.initApp();
        //this.modal.close();
        this.alert.updateOk();
      },
      (err) => {
        this.alert.updateError();
      }
    );
  }
}

openModalGestion() {
  this.onResetForm();
  //this.modal.open(this.nameModalGestion);
}

onResetForm() {
  this.submitted = false;
  this.formObjetivo.reset();
  //this.formEstrategia.reset();
}

}
