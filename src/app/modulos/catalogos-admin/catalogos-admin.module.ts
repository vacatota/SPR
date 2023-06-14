import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';// Importa AppRouting.module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogosRoutingAdminModule } from './catalogos-admin.routing';
import { AreaComponent } from './components/area/area.component';
import { PlanInstitucionalComponent } from './components/plan-institucional/plan-institucional.component';
import { EquipoGerencialComponent } from './components/equipo-gerencial/equipo-gerencial.component';
import { PlanAniosComponent } from './components/plan-anios/plan-anios.component';



@NgModule({
  declarations: [
    PlanAniosComponent,
  EquipoGerencialComponent,
    AreaComponent,
    PlanInstitucionalComponent,
  ],
  imports: [
    CommonModule,
    CatalogosRoutingAdminModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    SharedModule
  ]
})


export class CatalogosAdminModule { }
