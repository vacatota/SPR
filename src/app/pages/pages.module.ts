
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';// Importa AppRouting.modiule
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesRoutingModule } from './pages.routing';




@NgModule({
  declarations: [  
    DashboardComponent,
  
  ],

  //Enviar
 /*  exports: [
    DashboardComponent,
   
    ], */
  // Traer

  imports: [
    
    CommonModule,
    RouterModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ]
})
export class PagesModule { }
