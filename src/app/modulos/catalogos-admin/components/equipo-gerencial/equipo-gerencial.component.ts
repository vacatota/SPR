import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { IpPublicService } from 'src/app/services/ip-public.service';
import { AlertService } from 'src/app/services/alert.service';
import { EquipoGerencialService } from 'src/app/modulos/catalogos-proces/services/equipo.gerencial.service';
import { ModalService } from 'src/app/services/modal.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CatComunService } from '../../services/cat-comun.service';

@Component({
  selector: 'app-equipo-gerencial',
  templateUrl: './equipo-gerencial.component.html',
  styleUrls: ['./equipo-gerencial.component.css']
})
export class EquipoGerencialComponent implements OnInit, OnDestroy{
  breadCrumbItems = [{label: 'Admnistración procesos'}, {label: 'Gestión planes'}, {label: 'Equipo gerencial.', active: true}];
  public formUser!: UntypedFormGroup;
  public formEquipoGerencial!: FormGroup;
  public formRol!: FormGroup;
  public ipAddress!: string;
  public mostrarModal: boolean = false;
  public listaEquipoGerencialGuardar: any = [];
  public dataEquipoGerencial!: any;
  formSubmitted: boolean = false;

  buffer!: any;
  currentUser!: any
  public nombres!: any;
  public apellidos!: any;
  public grado!: any;
  dataUserSiipne: any;
  nameModal: string= "modalUsuariosSiipne";
  nameApp: string= "EQUIPO GERENCIAL";
  dataGerencialRoles: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  isDtInitialized: boolean = false;
  dtElement: DataTableDirective;
  listaEquipoGerencial=[];
  private idDeleteRegister: number = 0;
  listaCat=[];
  nameEquipoGerencial="EQUIPO GERENCIAL"
  private idSprAmbiente:number;

  constructor(
    private fb: FormBuilder,
    private equipoGerencialService: EquipoGerencialService,
    private ip: IpPublicService,
    private alert:AlertService,
    public modal: ModalService,
    private catComunService: CatComunService,

  ){

    this.buffer = localStorage.getItem('currentUser'); 
    this.currentUser = JSON.parse(this.buffer);
    this.idSprAmbiente = this.currentUser.idSprAmbiente;

    this.formEquipoGerencial = this.fb.group({
      idSprEquipoGerencial: [''],
      idSprAmbiente: [''],
      idSprTipoParticipante: [''],
      gradoNombres: ['', Validators.required],
      cedula: ['', Validators.required],
      estado: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],

    });

  }

  ngOnInit(): void {
    this.initApp()
    this.getIpPublic()

  }


  getIpPublic() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  setForm() {
    this.formUser = this.fb.group({
      idSprUsuario: [0],
      cedula: ['', [Validators.required]],
    });


    this.formEquipoGerencial = this.fb.group({
            idSprEquipoGerencial: [''],
            idSprAmbiente: [''],
            idSprTipoParticipante: [''],
            gradoNombres: [''],
            cedula: [''],
            estado: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            fechaFin: ['', Validators.required],
    });


    this.formRol = this.fb.group({
      idSprTipoParticipante: [''],
      idSprAmbiente: [''],


  });
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  
  initApp() {


    this.setDataTable();
    this.setForm();
  this.getEquipoGerenciales();
  this.getDataCatalogosTipoParticipante();
  
   
  }


getEquipoGerenciales(){
  
  this.equipoGerencialService.list("?idSprAmbiente=" + this.idSprAmbiente).subscribe(lista=>{this.listaEquipoGerencial = lista 
    this.reDrawDataTable()})

}

getDataCatalogosTipoParticipante(){
  this.catComunService.list("?spr_idSprComun=271").subscribe(lista=>{this.listaCat = lista})

}

getNombreTipoParticipacion(id: number, tipoParticipantes: any[]) {
  return tipoParticipantes?.filter((participacion) => {
    return participacion.idSprComun === id;
  });
}


createParticipantes(){

}

createEquipoGerencial(){
 
  this.formEquipoGerencial.value.usuario = this.currentUser.idSprUsuario;
  this.formEquipoGerencial.value.ip = this.ipAddress;
  this.formEquipoGerencial.value.gradoNombres = `${this.grado}. ${this.apellidos} ${this.nombres}`
  this.formEquipoGerencial.value.cedula = this.formUser.value.cedula
  this.formEquipoGerencial.value.delLog = "N";
  this.formEquipoGerencial.value.idSprAmbiente= this.currentUser.idSprAmbiente;
  this.formEquipoGerencial.value.ip = this.ipAddress;
  this.formSubmitted = true;
  console.log(this.formEquipoGerencial.value);
  let FechaInicial = this.formEquipoGerencial.value.fechaInicio
  let fechaFinal = null
 

  // if (FechaInicial > fechaFinal) {
  //   this.alert.alert("ERROR",  "La fecha inicial no puede ser mayor a la fecha Fin",  "error");

  // }


    //Realizar el posteo
    if (this.formEquipoGerencial.value.idSprEquipoGerencial == null) {
      this.formEquipoGerencial.value.fechaInicio = FechaInicial
      this.formEquipoGerencial.value.fechaFin = fechaFinal
      // this.formEquipoGerencial.value.gradoNombres = this.formEquipoGerencial.value.gradoNombres

      this.equipoGerencialService.create(this.formEquipoGerencial.value)
        .subscribe(resp => {
          this.initApp()
        
          this.modal.closeId(this.nameModal)
          this.alert.createOk();
        }, (err) => {
          this.alert.createError();

          
          
        });
    } else {
      this.equipoGerencialService.update(this.formEquipoGerencial.value)
        .subscribe(resp => {

          this.initApp()
          this.modal.closeId(this.nameModal)
          this.alert.updateOk(
            "Felicitaciones!",
            "Registro actualizado correctamente",
                      )

        }, (err) => {
          this.alert.createError();
        });
    }
  

}

 

  setearValores(data: any) {
    this.nombres = data.nombres;
    this.apellidos = data.apellidos;
    this.grado = data.grado;
  }

  validarCedula(cedula: string):boolean {
 console.log(cedula)
    if (cedula == null) {
      this.alert.warning('Atención!',
     'Debe ingresar el número de cédula'
     );
     return false;
    }
   
   if (cedula.length < 10) {
    this.alert.warning('Atención!',
     'El número de cédula debe tener 10 digitos'
     );
     return false;
   }
   return true;
   }


  buscaPersona(){
    
    if(this.validarCedula(this.formUser.value.cedula) || this.formUser.value.cedula == undefined){
    this.formSubmitted = true;
    try{
    if (!this.formUser.invalid) {
      this.equipoGerencialService
        .getPersonaSiipne(this.formUser.value.cedula)
        .subscribe((response) => {
          this.dataUserSiipne = response;
          if(!response){
           
            this.alert.warning('No existe usuario con esta cédula.','Atención')       
          }else{
            this.setearValores(this.dataUserSiipne);
          }
        });
      return;
    } else {
      return;
    }}
    catch{
      console.log("Ingrese nuevamente número de cédula");
    }
  }
  }

  openModal() {
    this.onResetForm();
 
    this.modal.open(this.nameModal);
  }


  onResetForm() {
    this.formSubmitted = false;
    this.formEquipoGerencial.reset();
    this.formUser.reset();
    this.nombres="";
    this.grado="";
    this.apellidos="";
  }


  updateEquipoGerencial(obj: any) {
    this.modal.open(this.nameModal);
    this.formEquipoGerencial.patchValue({
      idSprAnio: obj.idSprAnio,
      idSprEquipoGerencial: obj.idSprEquipoGerencial,
      idSprTipoParticipante: obj.idSprTipoParticipante,
      idSprPlanInstitucional: obj.idSprPlanInstitucional,
      anio: obj.anio,
      fechaInicio: obj.fechaInicio,

      fechaFin: obj.fechaFin,
      vigencia: obj.vigencia,
      estado: obj.estado
    });
    let datosDesarmados = obj.gradoNombres.split(" ")
    this.grado= datosDesarmados[0]
    this.nombres=  `${datosDesarmados[1]} ${datosDesarmados[2]}` 
    this.apellidos= `${datosDesarmados[3]} ${datosDesarmados[4]}` 
    this.formUser.patchValue({

      cedula:obj.cedula


    })
  }
  closeModal() {
    this.modal.close()
  }


confirmDelete() {
  if (this.idDeleteRegister > 0) {
    this.equipoGerencialService.delete({
      "idSprEquipoGerencial": this.idDeleteRegister,
      "usuario": this.currentUser.idSprUsuario,
      "delLog": "S",
      "ip": this.ipAddress
    })
      .subscribe(resp => {
        this.initApp();
        this.modal.closeId("deleteEquipoGeren");
        console.log("Catalogo Anios creado correctamente")
        console.log(resp)

        this.alert.deleteOk(
          'Correcto', 
          'Registro eliminado correctamente.')

      }, (err) => {
        this.alert.deleteError(
          'Error!', 
          'Ocurrió un error al eliminar el registro.') 
      });



  }
}

deleteEquipoGerencial(idRegister: number) {
  this.modal.open('deleteEquipoGeren');
  this.idDeleteRegister = idRegister;
}



}




