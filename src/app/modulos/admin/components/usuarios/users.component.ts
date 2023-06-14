import { Component, OnDestroy, OnInit,  ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RolService } from './../../services/rol.service';
import { AmbRolUsuarioService } from './../../services/amb.rol.usuario.service';
import { IpPublicService } from './../../../../services/ip-public.service'; 
import { AmbienteService } from '../../../catalogos-admin/services/ambiente.service';
import { AlertService } from '../../../../services/alert.service';
import { ModalService } from '../../../../services/modal.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {

  breadCrumbItems = [{label: 'Administración Sistema'}, {label: 'Administración'}, {label: 'Usuarios', active: true}];

  public formUser!: UntypedFormGroup;
  public formRolAmbienteUser!: FormGroup;
  public formSubmittedAmbienteRol = false;
  public formSelectAplicaciones!: FormGroup;
  //public submitted = false;
  public formSubmitted = false;
  private currentUser!: any;
  private ipAddress!: string;
  private buffer!: any;
  public dataApp: any[] = [];
  public dataUserSiipne!: any;
  private idDeleteRegister: number = 0;
  public selectItems: any[] = [];
  public nameModal: string = 'modalNewEdit'
  nameApp = 'Usuarios';

  public dataRoles!: any;
  public dataAmbientes!: any;
  public dataAmbientesRoles!: any;
  public dataAmbientesRolesUsuarios!: any;
  public userCurrentGestion!:any;
  public idSprUsuarioAplicacionSeleccionado!: any;

  public nombres!: any;
  public apellidos!: any;
  public grado!: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  isDtInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private rolService: RolService,
    private alert: AlertService,
    private ip: IpPublicService,
    public modal: ModalService,
    private ambienteService:AmbienteService,
    private ambRolUsuarioService:AmbRolUsuarioService,
    private userService:UserService,
    
  ) {
  
    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);
    this.selectItems = [
      { value: '', label: 'Seleccione' },
      { value: 1, label: 'Activo' },
      { value: 2, label: 'Inactivo' },
    ];

  }

  setSelectRoles(){
    
  }

  get rolForm() {
    return this.formUser.controls;
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
    this.formUser = this.fb.group({
      idSprUsuario: [0],
      cedula: ['', [Validators.required]],
    });
    this.formRolAmbienteUser = this.fb.group({
      idSprAmbRolUsuario: [''],
      idSprUsuario: ['', [Validators.required]],
      idSprRol: [' ', [Validators.required]],
      idSprAmbiente: [' ', [Validators.required]],
    });

    this.formSelectAplicaciones = this.fb.group({
      spr_idSprAplicacion: ['0', []],
    });


 /*    this.formUser.patchValue({
      estado: this.selectItems[0].value,
    }); */
  }
  ngOnInit(): void {
    this.getIpPublic();
    this.initApp();
  }

  initApp(){
    
    //this.listAmbientes();
  this.listUsers();
  this.setDataTable();
  this.setForm(); 
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

     //##########################################
  // Trae usuarios del sistema
  //#########################################
  listUsers() {
    this.userService.getDataUsers().subscribe((resp) => {
      this.dataApp = resp;
      this.reDrawDataTable();// OOOOOJJJJJOOOOO 
    });
  }

  listDataApp() {
    this.rolService.list().subscribe((resp) => {
      this.dataApp = resp;
      this.reDrawDataTable();// OOOOOJJJJJOOOOO 
    });
  }
  

    //##########################################
  // Trae catalogo de ambientes
  //#########################################
  listAmbientes() {
    this.ambienteService.list().subscribe((resp) => {
      this.dataAmbientes = resp;
      console.log('Ambientes:  ', this.dataAmbientes);
      this.getAmbRolesUsers();
    });
  }
    //##########################################
  // Trae catalogo de sprAmbRolUsuario
  //#########################################
  getAmbRolesUsers() {
    this.ambRolUsuarioService.list().subscribe((resp) => {
      this.dataAmbientesRolesUsuarios = resp;
      console.log('AmbRolesUsers: ', this.dataAmbientesRolesUsuarios);
      this.getDataRoles();
    });
  }
   //##########################################
  // Trae catalogo de roles
  //#########################################
  getDataRoles() {
    this.rolService.list().subscribe((resp) => {
      this.dataRoles = resp;
      console.log('Roles: ', resp);
      this.mapeoUsuarioAmbienteRol();
    });
  }
 

  mapeoUsuarioAmbienteRol() {
    let dataProcess: any = [];
    for (let i = 0; i < this.dataAmbientesRoles.length; i++){
      for (let j = 0; j < this.dataAmbientes.length; j++){
        if (
          this.dataAmbientesRoles[i].idSprAmbiente ==
          this.dataAmbientes[j].idSprAmbiente
          ) {
            for (let k = 0; k < this.dataRoles.length; k++){
            if (
              this.dataAmbientesRoles[i].idSprRol == this.dataRoles[k].idSprRol
            ) {
              dataProcess.push({
                idSprAmbRolUsuario:
                  this.dataAmbientesRoles[i].idSprAmbRolUsuario,
                idSprAmbiente: this.dataAmbientesRoles[i].idSprAmbiente,
                nombreUnidad: this.dataAmbientes[j].nombreUnidad,
                nivel: this.dataAmbientes[j].nivel.nombre,
                idSprRol: this.dataRoles[k].idSprRol,
                nombreRol: this.dataRoles[k].nombre,
              });
            }
          }
        }
      }
    }
    console.log("Data mapeado: ", this.dataAmbientesRoles)
    this.dataAmbientesRoles = dataProcess;
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

 
  delete(idRegister:number) {
    this.modal.open('delete');
   this.idDeleteRegister= idRegister;
  } 
  confirmDelete() {
    if (this.idDeleteRegister > 0) {
      this.rolService.delete(      
        {"idSprRol":this.idDeleteRegister, 
        "usuario":this.currentUser.idSprUsuario, 
        "delLog":"S",
        "ip":this.ipAddress
      }     
      )
        .subscribe(resp => {
          this.initApp();
          this.modal.close()   
         this.alert.deleteOk(); 
        }, (err) => {
          this.alert.deleteError();        
        });
      }
  }  
  
  deleteUserRol(idRegister:number) {
    this.modal.open('delete-user-rol');
   this.idDeleteRegister= idRegister;
   console.log('Id borrar: ', this.idDeleteRegister);
  }

  confirmDeleteUSerRolAmbiente() {
    if (this.idDeleteRegister > 0) {
      this.ambRolUsuarioService.delete(      
        {"idSprAmbRolUsuario":this.idDeleteRegister, 
        "usuario":this.currentUser.idSprUsuario, 
        "delLog":"S",
        "ip":this.ipAddress
      }     
      )
        .subscribe(resp => {
          this.modal.closeId('delete-user-rol')   
          this.changeDataUser(this.userCurrentGestion);
         this.alert.deleteOk(); 
        }, (err) => {
          this.alert.deleteError();        
        });
      }
  }

  openModal() {
    this.onResetForm();
    this.modal.open(this.nameModal);
  }

  closeModal() {
    this.modal.close()  
  }

  onResetForm(){
    this.formSubmitted = false;
    this.formUser.reset();
  }


  createUser(){}
/*   deleteUsuarioRolAmbiente(idsprAmbUsuarioRol: number){    
        this.ambRolUsuarioService
          .delete({
            idsprAmbRolUsuario: idsprAmbUsuarioRol,
            usuario: this.currentUser.idSprUsuario,
            delLog: 'S',
            ip: this.ipAddress,
          })
          .subscribe(
            (resp) => {
              this.initApp();
              this.changeDataUser(this.userCurrentGestion);
              this.alert.deleteOk()   
            },
            (err) => {
              this.alert.deleteError()   
            }
          );
  } */

  buscaPersona(){
    this.limpiarCamposUsuarioNuevo();
    if(this.validarCedula(this.formUser.value.cedula) || this.formUser.value.cedula == undefined){
    this.formSubmitted = true;
    try{
    if (!this.formUser.invalid) {
      this.userService
        .getPersonaSiipne(this.formUser.value.cedula)
        .subscribe((response) => {
          this.dataUserSiipne = response;
          if(!response){
           // objAlert = {title:'Atención!',text: 'No existe usuario con esta cédula',icon: 'success'}
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

   //##########################################
  // Carga datos de usuario en los formularios
  //##########################################
  changeDataUser(rowUser: any) {
    this.listAmbientes();
    console.log('Change dta selected: ', rowUser);
    this.userCurrentGestion = rowUser;
    this.idSprUsuarioAplicacionSeleccionado =
      rowUser.idSprUsuario > 0 ? rowUser.idSprUsuario : 0;
    this.idSprUsuarioAplicacionSeleccionado >= 1 ? this.getDataRolAmbienteUser(rowUser.idSprUsuario)
      : '';
    this.openModal();
    //this.mostrarModal = true;
    rowUser.idSprRol >= 0 ? rowUser.idSprRol : 0;
    rowUser.idSprAmbiente >= 0 ? rowUser.idSprAmbiente : 0;
    
    this.formRolAmbienteUser.patchValue({
      idSprUsuario: rowUser.idSprUsuario,
      idSprRol: rowUser.idSprRol,
      idSprAmbiente: rowUser.idSprAmbiente,
    });
    this.formUser.patchValue({
      cedula: rowUser.cedula,
      idSprUsusario: rowUser.idSprUsusario,
    });
    this.apellidos = rowUser.apellidos;
    this.grado = rowUser.grado;
    this.nombres = rowUser.nombres;
  }

    //##########################################
  // Trae datos de sprUsuarioRolAmbiente
  //#########################################
  getDataRolAmbienteUser(idSprUsuario: number) {
    this.ambRolUsuarioService
      .list(`?idSprUsuario=${idSprUsuario}`)
      .subscribe((resp) => {
        this.dataAmbientesRoles = resp;
        console.log('Usuario-rol-ambiente: ', this.dataAmbientesRoles);
     //TODOOOOOOOOOOOOOOOOOOOOOOOO   
        this.getDataRoles();
        //this.mapeoUsuarioAmbienteRol();
      });
  }

  setearValores(data: any) {
    this.nombres = data.nombres;
    this.apellidos = data.apellidos;
    this.grado = data.grado;
  }
  validarCedula(cedula: string):boolean {
 
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

  limpiarCamposUsuarioNuevo() {
    this.nombres = '';
    this.apellidos = '';
    this.grado = '';
  }
  
  createAmbienteRolUser(){
    this.formRolAmbienteUser.value.usuario = this.currentUser.idSprUsuario;
    this.formRolAmbienteUser.value.ip = this.ipAddress;
    this.formRolAmbienteUser.value.idSprAmbRolUsuario = null;
    this.formRolAmbienteUser.value.estado = 1;
    this.formRolAmbienteUser.value.delLog = "N";
    this.formSubmittedAmbienteRol = true;
    if (!this.formRolAmbienteUser.invalid) {
      //Realizar el posteo
      if (this.formRolAmbienteUser.value.idSprUsuario >= 1) { 
        try {
          this.ambRolUsuarioService.create(this.formRolAmbienteUser.value).subscribe({
            next: (data) => {
              this.alert.createOk();   
              this.initApp();
              this.changeDataUser(this.userCurrentGestion);
            },
            error: (error) => {
              console.log('Error: ',error );
              this.alert.alert('Ups!', 'No se puede crear,  el '+  error.error.detail, 'warning');  
            },
          });
        } catch (e) {
          console.error("catch",e);
        }
      }
      //this.initApp();
    } else {
      console.log('Form invalido: ');
    }


  }

  createUserSpr(){
    if(this.dataUserSiipne){
          this.dataUserSiipne.estado = 1;
          this.dataUserSiipne.ip = this.ipAddress;
          this.dataUserSiipne.usuario = this.currentUser.idSprUsuario;
          try {
            this.userService.create(this.dataUserSiipne).subscribe({
              next: (data: any) => {
                this.alert.success('Correcto','Usuario creado correctamente.')   
                this.closeModal();
                this.limpiarCamposUsuarioNuevo();
              },
              error: (response: any) => {
                this.alert.warning('Atención!','No se puede crear el usuario, el ' + response.error.detail)                 
                console.log(response.error);
              },
            });
          } catch (e) {
            console.error(e);
          }
    }else{
      this.alert.warning('Atención!','Primero debe buscar un usuario')
       
    }
  }

}
