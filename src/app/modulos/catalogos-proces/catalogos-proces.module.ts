import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogoProcesRouting } from './catalogo-proces.routing';
import { SubsistemaComponent } from './components/subsistema/subsistema.component';
import { EspecialDosComponent } from './components/especial-dos/especial-dos.component';
import { ComunesComponent } from './components/comunes/comunes.component';
import { EspecialUnoComponent } from './components/especial-uno/especial-uno.component';
import { UmbralesComponent } from './components/umbrales/umbrales.component';
import { AmbienteComponent } from './components/ambiente/ambiente.component';
import { TreeModule } from "primeng/tree";




@NgModule({
  declarations: [
    AmbienteComponent,
    ComunesComponent,
    EspecialDosComponent,
    SubsistemaComponent,
    EspecialUnoComponent,
    UmbralesComponent,
    AmbienteComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule, 
    HttpClientModule,
    DataTablesModule,
    CatalogoProcesRouting,
    SharedModule,
    TreeModule
  ]

})
export class CatalogosProcesModule {} 
