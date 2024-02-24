import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HorariosRoutingModule } from './horarios-routing.module';
import { PrincipalComponent } from './components/principal/principal.component';
import { HorarioFormComponent } from './components/horario-form/horario-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {  MatCardModule } from '@angular/material/card';
import { GenerarCitasModalComponent } from './components/generar-citas-modal/generar-citas-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
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
