import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';// Importa AppRouting.module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { RolesComponent } from './components/roles/roles.component';
import { AdminRoutingModule } from './admin.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersComponent } from './components/usuarios/users.component';
import { PermisosComponent } from './components/permisos/permisos.component';

@NgModule({
  declarations: [
    RolesComponent,
    UsersComponent,
    PermisosComponent,
  ],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    SharedModule,

    AdminRoutingModule,
  ]
})
export class AdminModule {}

