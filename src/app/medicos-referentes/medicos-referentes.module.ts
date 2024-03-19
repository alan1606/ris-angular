import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicosReferentesRoutingModule } from './medicos-referentes-routing.module';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegistroMedicoReferendeComponent } from './components/registro-medico-referende/registro-medico-referende.component';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MedicoReferenteDatosFormComponent } from './components/medico-referente-datos-form/medico-referente-datos-form.component';
import { PrincipalMedicosReferentesComponent } from './components/principal-medicos-referentes/principal-medicos-referentes.component';
import { EstudiosComponent } from './components/estudios/estudios.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component'
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
@NgModule({
  declarations: [
    LandingPageComponent,
    RegistroMedicoReferendeComponent,
    MedicoReferenteDatosFormComponent,
    PrincipalMedicosReferentesComponent,
    EstudiosComponent,
    CatalogoComponent
  ],
  imports: [
    CommonModule,
    MedicosReferentesRoutingModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MedicosReferentesModule { }
