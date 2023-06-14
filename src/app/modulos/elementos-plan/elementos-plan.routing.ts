import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AtribucionComponent } from './components/atribucion/atribucion.component';
import { ObjetivosComponent } from './components/objetivos/objetivos.component';
import { PlanAccionComponent } from './components/plan-accion/plan-accion.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { EstrategiasComponent } from './components/estrategias/estrategias.component';
import { ProcesoComponent } from './components/proceso/proceso.component';
 import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { IndicadoresProcesosComponent } from './components/indicadores/indicadores-procesos/indicadores-procesos.component';
import { IndicadoresComponent } from './components/indicadores/indicadores.component';
import { LineaAccionComponent } from './components/linea-accion/linea-accion.component';
import { RiesgosComponent } from './components/riesgos/riesgos.component';

const routesAdmin: Routes = [
  {
    path: '',
    //component: PagesComponent,//Ruta protegida: En PagesComponent se renderiza todo lo de estas rutas de abajo
    //canActivate:[AuthGuard],
    children:
    [
      { path: 'objetivos', component: ObjetivosComponent, data:{title:'Objetivos'} },
      { path: 'indicadores', component: IndicadoresComponent, data:{title:'Indicadores'} },
      { path: 'linea-accion', component: LineaAccionComponent, data:{title:'PLan Acción'} },
      { path: 'plan-accion', component: PlanAccionComponent, data:{title:'PLan Acción'} },
      { path: 'actividades', component: ActividadesComponent, data:{title:'Actividades'} },
      { path: 'estrategias', component: EstrategiasComponent, data:{title:'estrategias'} },
      { path: 'atribucion', component: AtribucionComponent, data:{title:'Atribución'} },
      { path: 'procesos', component: ProcesoComponent, data:{title:'Proceso'} },
       { path: 'proyectos', component: ProyectoComponent, data:{title:'Proyecto'} },
      { path: 'riesgos', component: RiesgosComponent, data:{title:'Riesgos'} },
    ]
  },//Para rutas protegidas

/*   {
    path: '',
    component: IndicadoresComponent,//Ruta protegida: En PagesComponent se renderiza todo lo de estas rutas de abajo
    //canActivate:[AuthGuard],
    children:
    [
      { path: 'indicadores/procesos', component: ProcesosComponent, data:{title:'Proyecto'} },
    ]
  },//Para rutas protegidas */
];


@NgModule({
  imports: [RouterModule.forChild(routesAdmin)],//Para rutas hijas
  exports: [RouterModule]
})

export class ElementosPlanRoutingModule {

}

