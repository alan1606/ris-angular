import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegistroMedicoReferendeComponent } from './components/registro-medico-referende/registro-medico-referende.component';

const routes: Routes = [

  {
    path:"landing",
    component:LandingPageComponent
  },
  {
    path:"registro",
    component:RegistroMedicoReferendeComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicosReferentesRoutingModule { }
