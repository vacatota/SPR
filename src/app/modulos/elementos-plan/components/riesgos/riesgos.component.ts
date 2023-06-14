

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-riesgos',
  templateUrl: './riesgos.component.html',
  styleUrls: ['./riesgos.component.css']
})
export class RiesgosComponent {
 
  public nameApp = 'Riesgos';
  public objetivo = '';
  public lineaAccion = '';
  public planAccion = '';
  public proyecto = '';
  public proceso = '';
  public nameLineaAccion: any;
  public nivelSelect!: number
  private currentUser!: any;
  private buffer!: any;
  public idSprNivelN5: number = 287; //validacion (de nivel n5)


  constructor(  ) {
    this.openObjetivos();
    this.openLineasAccion();
    this.openPlanesAccion();
    this.openProyectos();  
    this.buffer = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.buffer);

    this.nivelSelect = this.currentUser.idSprNivel
    console.log("  this.nivelSelect",  this.nivelSelect)
  }

  


  openObjetivos() {
    this.nameLineaAccion = 'nav-objetivos'
    this.objetivo = 'objetivo'    
  }
  openLineasAccion() {    
   
    this.lineaAccion = 'lineas-accion'
  }

  openPlanesAccion() {

    this.planAccion = 'planes-accion'
  }
  openProyectos() {
    this.proyecto = 'proyecto';
  }
  openProcesos() {
    this.proceso = 'proceso';
  }


}
