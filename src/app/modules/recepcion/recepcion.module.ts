import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    AgendarCitaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [
    AgendarCitaComponent
  ]
})
export class RecepcionModule { }
