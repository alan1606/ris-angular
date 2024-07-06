import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicosReferentesRoutingModule } from './medicos-referentes-routing.module';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { RegistroMedicoReferendeComponent } from './components/registro-medico-referende/registro-medico-referende.component';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MedicoReferenteDatosFormComponent } from './components/medico-referente-datos-form/medico-referente-datos-form.component';
import { EstudiosComponent } from './components/estudios/estudios.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component'
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
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
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class MedicosReferentesModule { }
