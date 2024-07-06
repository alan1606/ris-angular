import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorariosRoutingModule } from './horarios-routing.module';
import { PrincipalComponent } from './components/principal/principal.component';
import { HorarioFormComponent } from './components/horario-form/horario-form.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {  MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { GenerarCitasModalComponent } from './components/generar-citas-modal/generar-citas-modal.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import { ApartarDiasComponent } from './components/apartar-dias/apartar-dias.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ApartarHorasComponent } from './components/apartar-horas/apartar-horas.component';


@NgModule({
  declarations: [
    PrincipalComponent,
    HorarioFormComponent,
    GenerarCitasModalComponent,
    ApartarDiasComponent,
    ApartarHorasComponent
  ],
  imports: [
    CommonModule,
    HorariosRoutingModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule
  ]
})
export class HorariosModule { }
