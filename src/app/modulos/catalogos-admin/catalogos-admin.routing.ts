import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanAniosComponent } from './components/plan-anios/plan-anios.component';
import { EquipoGerencialComponent } from './components/equipo-gerencial/equipo-gerencial.component';
import { PlanInstitucionalComponent } from './components/plan-institucional/plan-institucional.component';
import { AreaComponent } from './components/area/area.component';



const routesCatalogoAdmin: Routes = [
  {
    path: '',
    //component: PagesComponent,//Ruta protegida: En PagesComponent se renderiza todo lo de estas rutas de abajo
    //canActivate:[AuthGuard],
    children:
    [
      { path: 'areas', component: AreaComponent },
      { path: 'plan-institucional', component: PlanInstitucionalComponent, data:{title:'Plan institucional'} },
      { path: 'plan-anios', component: PlanAniosComponent, data:{title:'plan Años'} },
      { path: 'equipo-gerencial', component: EquipoGerencialComponent, data:{title:'equipo gerencial'} },
    ]
  },//Para rutas protegidas
];

@NgModule({
 imports: [RouterModule.forChild(routesCatalogoAdmin)],//Para rutas hijas
  exports: [RouterModule]

   
  
})

export class CatalogosRoutingAdminModule { }
