import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/usuarios/users.component';
import { PermisosComponent } from './components/permisos/permisos.component';

const routesAdmin: Routes = [
  {
    path: '',
    //component: PagesComponent,//Ruta protegida: En PagesComponent se renderiza todo lo de estas rutas de abajo
    //canActivate:[AuthGuard],
    children: 
    [
      { path: 'roles', component: RolesComponent, data:{title:'Roles'} },
      { path: 'usuarios', component: UsersComponent, data:{title:'Usuarios'} },
      { path: 'permisos', component: PermisosComponent, data:{title:'Permisos'} },
  
    ]
  },//Para rutas protegidas
];


@NgModule({
  imports: [RouterModule.forChild(routesAdmin)],//Para rutas hijas
  exports: [RouterModule]
})

export class AdminRoutingModule {

}

