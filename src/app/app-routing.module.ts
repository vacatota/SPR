import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,// Se renderiza rutas protegidas en la plantilla
    canActivate:[AuthGuard],
    children: [
      { path: 'admin',loadChildren: () => import('./modulos/admin/admin.module').then(m => m.AdminModule) },   
      { path: 'catalogos-proces',loadChildren: () => import('./modulos/catalogos-proces/catalogos-proces.module').then(m => m.CatalogosProcesModule) },   
      { path: 'catalogos-admin',loadChildren: () => import('./modulos/catalogos-admin/catalogos-admin.module').then(m => m.CatalogosAdminModule) },   
      { path: 'pages',loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
      { path: 'elementos-plan',loadChildren: () => import('./modulos/elementos-plan/elementos-plan.module').then(m => m.ElementosPlanModule) },   
              
      //{ path: '', redirectTo: 'pages' },  
      //{ path: '**', redirectTo: 'pages/dashboard' },  
    ]
  },
  { path: 'login', 
    loadChildren: () => import('./modulos/auth/auth.module').then(m => m.AuthModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }



