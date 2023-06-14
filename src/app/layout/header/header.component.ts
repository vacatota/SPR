import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, UntypedFormGroup, NgModelGroup } from '@angular/forms';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from './../../modulos/auth/services/auth.service';
import { AlertService } from './../../services/alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
private buffer!:any;
private currentUser!:any;
public userLogued!:any;
selectedOption: any;
dataUsuarioRolesAmbientes!: any;
public formSelectRolAmbiente!:FormGroup;
  rolesAmbienteUserString!: any;
  idSprAmbiente!: number;
  idRolAmbiente!: any;
  

  constructor(
    private authService:AuthService, 
    public router:Router,
    private alert:AlertService,
    private fb: FormBuilder
    ) {
      this.buffer = localStorage.getItem('currentUser');
   this.currentUser = JSON.parse(this.buffer);
   this.userLogued = this.currentUser.nombres.split(' ');
   this.userLogued = this.userLogued[0]+ " " + this.userLogued[3]+ " " + this.userLogued[1];
   this.dataUsuarioRolesAmbientes = this.currentUser.userAmbiente;   
    
  
    this.setRolAmbiente();
  }
  
  setSelectAmbienteRol(){
    this.formSelectRolAmbiente = this.fb.group({
      idSprRolAmbiente: [this.selectedOption]
    });
  }

  ngOnInit(): void {

    this.setSelectAmbienteRol();
  }

   // Recupera de locaStorage idSprRol e idSprAmbiente
 setRolAmbiente() {
  if (this.currentUser.idSprRol && this.currentUser.idSprAmbiente && this.currentUser.idSprNivel) {
    this.selectedOption = this.currentUser.idSprRol + "*" + this.currentUser.idSprAmbiente + "*" + this.currentUser.nombreUnidad+ "*" + this.currentUser.idSprNivel; 
    
  }
} 

changeRolAmbienteSelected(e:any){
  //console.log('Selected: ', e.target.value);
  this.idRolAmbiente = e.target.value.split('*');
  //console.log("Selected rol/ambiente: ", this.idRolAmbiente)
  this.currentUser.idSprRol = this.idRolAmbiente[0];
  this.currentUser.idSprAmbiente =  this.idRolAmbiente[1];
  this.currentUser.nombreUnidad =  this.idRolAmbiente[2];
  this.currentUser.idSprNivel =  this.idRolAmbiente[3];
  localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
  window.location.reload();
}
  logout() {
    this.authService.logout();
    var url = "http://localhost:4200/login/auth";
    window.location.href = url;
    //this.router.navigateByUrl('login/auth');
    //this.router.navigate(['login/auth']);
    //this.alert.alert("Gracias por utlizar el SPR.", "Adios!", "info")
    
  }

}
