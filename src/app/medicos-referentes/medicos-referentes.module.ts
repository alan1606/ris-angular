import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicosReferentesRoutingModule } from './medicos-referentes-routing.module';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegistroMedicoReferendeComponent } from './components/registro-medico-referende/registro-medico-referende.component';
import {MatListModule} from '@angular/material/list';
@NgModule({
  declarations: [
    LandingPageComponent,
    RegistroMedicoReferendeComponent
  ],
  imports: [
    CommonModule,
    MedicosReferentesRoutingModule,
    MatListModule
  ]
})
export class MedicosReferentesModule { }
