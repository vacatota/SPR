import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
{
      path: '',
    children: [
       { path: 'auth', component: LoginComponent},
    ]  
   // { path: 'login', component: LoginComponent }, 
  }
];

 
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {

}
