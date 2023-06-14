import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubsistemaComponent } from './components/subsistema/subsistema.component';
import { EspecialDosComponent } from './components/especial-dos/especial-dos.component';
import { ComunesComponent } from './components/comunes/comunes.component';
import { EspecialUnoComponent } from './components/especial-uno/especial-uno.component';
import { UmbralesComponent } from './components/umbrales/umbrales.component';
import { AmbienteComponent } from './components/ambiente/ambiente.component';

const routesCataloProces: Routes = [
  {
    path: '',
    children: [
      { path: 'ambientes', component: AmbienteComponent },
      { path: 'subsistemas', component: SubsistemaComponent },
      { path: 'especialdos', component: EspecialDosComponent },
      { path: 'comunes', component: ComunesComponent },
      { path: 'especialuno', component: EspecialUnoComponent },
      { path: 'umbrales', component: UmbralesComponent },
      { path: '**', redirectTo: 'dashboard' },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routesCataloProces)],//Para rutas hijas
  exports: [RouterModule]
})

export class CatalogoProcesRouting {

}
