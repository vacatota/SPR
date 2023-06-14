import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routesPages: Routes = [
    {
    path: '',
    children: [
       { path: 'dashboard', component: DashboardComponent, data:{title:'Dashboard'}},
      //{ path: '**', redirectTo: 'dashboard' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routesPages)],//Para rutas hijas
  exports: [RouterModule]
})

export class PagesRoutingModule {
}