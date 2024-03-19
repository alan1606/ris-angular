import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegistroMedicoReferendeComponent } from './components/registro-medico-referende/registro-medico-referende.component';
import { PrincipalMedicosReferentesComponent } from './components/principal-medicos-referentes/principal-medicos-referentes.component';
import { RecepcionGuard } from '../guards/recepcion.guard';
import { CatalogoComponent } from './components/catalogo/catalogo.component';

const routes: Routes = [

  {
    path:"landing",
    component:LandingPageComponent
  },
  {
    path:"registro",
    component:RegistroMedicoReferendeComponent
  },
  {
    path:"estudios",
    component:PrincipalMedicosReferentesComponent,
    canActivate:[RecepcionGuard]
  },
  {
    path:"catalogo",
    component:CatalogoComponent,
    canActivate:[RecepcionGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicosReferentesRoutingModule { }
