import { ConfigIndicadorLineaComponent } from './components/indicadores/indicadores-linea-accion/config-indicador-linea/config-indicador-linea.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControlDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/shared/shared.module';
import { ElementosPlanRoutingModule } from './elementos-plan.routing';
import { ObjetivosComponent } from './components/objetivos/objetivos.component';
import { PlanAccionComponent } from './components/plan-accion/plan-accion.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { EstrategiasComponent } from './components/estrategias/estrategias.component';
import { AtribucionComponent } from './components/atribucion/atribucion.component';
import { ProcesoComponent } from './components/proceso/proceso.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { IndicadoresProcesosComponent } from './components/indicadores/indicadores-procesos/indicadores-procesos.component';
import { IndicadoresLineaAccionComponent } from './components/indicadores/indicadores-linea-accion/indicadores-linea-accion.component';
import { IndicadoresProyectosComponent } from './components/indicadores/indicadores-proyectos/indicadores-proyectos.component';
import { IndicadoresObjetivosComponent } from './components/indicadores/indicadores-objetivos/indicadores-objetivos.component';
import { IndicadoresPlanAccionComponent } from './components/indicadores/indicadores-plan-accion/indicadores-plan-accion.component';
import { ObjetivosEstrategiasSuperiorComponent } from './components/objetivos/objetivos-estrategias-superior/objetivos-estrategias-superior.component';
import { ObjetivosEstrategiasComponent } from './components/objetivos/objetivos-estrategias/objetivos-estrategias.component';

import { LineaAccionComponent } from './components/linea-accion/linea-accion.component';
import { IndicadoresComponent } from './components/indicadores/indicadores.component';
import { RiesgosComponent } from './components/riesgos/riesgos.component';
import { RiesgoObjetivoComponent } from './components/riesgos/riesgo-objetivo/riesgo-objetivo.component';
import { RiesgoPlanAccionComponent } from './components/riesgos/riesgo-plan-accion/riesgo-plan-accion.component';
import { RiesgoProyectoComponent } from './components/riesgos/riesgo-proyecto/riesgo-proyecto.component';
import { HitoComponent } from './components/proyecto/hito/hito.component';

import { AccionComponent } from './components/riesgos/accion/accion.component';

import { RiesgoLineaAccionComponent } from './components/riesgos/riesgo-linea-accion/riesgo-linea-accion.component';

import { DesempenioProcesoComponent } from './components/proceso/desempenio-proceso/desempenio-proceso.component';
import { TreeModule } from 'primeng/tree';
import { ConfigIndicadorObjetivoComponent } from './components/indicadores/indicadores-objetivos/config-indicador-objetivo/config-indicador-objetivo.component';
import { AccionLineaComponent } from './components/riesgos/accion-linea/accion-linea.component';
import { AccionProyectoComponent } from './components/riesgos/accion-proyecto/accion-proyecto.component';
import { AccionPlanComponent } from './components/riesgos/accion-plan/accion-plan.component';
import { ActividadComponent } from './components/actividad/actividad.component';



@NgModule({
  declarations: [
    ObjetivosComponent,
    PlanAccionComponent,
    ActividadesComponent,
    EstrategiasComponent,
    AtribucionComponent,
    ProcesoComponent,
    ProyectoComponent,
    IndicadoresProcesosComponent,
    IndicadoresLineaAccionComponent,
    IndicadoresProyectosComponent,
    IndicadoresObjetivosComponent,
    IndicadoresPlanAccionComponent,
    IndicadoresComponent,
    ObjetivosEstrategiasSuperiorComponent,
    ObjetivosEstrategiasComponent,
    RiesgosComponent,
    RiesgoObjetivoComponent,
    RiesgoPlanAccionComponent,
    RiesgoProyectoComponent,
    LineaAccionComponent,
    AccionComponent,
    RiesgoLineaAccionComponent,
    HitoComponent,
    AccionComponent,
    DesempenioProcesoComponent,
    ConfigIndicadorObjetivoComponent,
    ConfigIndicadorLineaComponent,

    AccionLineaComponent,
    AccionProyectoComponent,
    AccionPlanComponent,
    ActividadComponent,
  ],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    ElementosPlanRoutingModule,
    SharedModule,
    TreeModule

  ]
})
export class ElementosPlanModule { }

