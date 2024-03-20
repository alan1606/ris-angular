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
import { EstudiosComponent } from './components/estudios/estudios.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component'
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
  declarations: [
    LandingPageComponent,
    RegistroMedicoReferendeComponent,
    MedicoReferenteDatosFormComponent,
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
    MatPaginatorModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MedicosReferentesModule { }
