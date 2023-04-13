import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AgendarCitaComponent } from './agendar-cita/agendar-cita.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppComponent } from 'src/app/app.component';



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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    AgendarCitaComponent
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class RecepcionModule { }
