import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstruccionesAreaComponent } from './components/instrucciones-area/instrucciones-area.component';
import { InstruccionesConceptoComponent } from './components/instrucciones-concepto/instrucciones-concepto.component';
import { InstruccionesInstitucionComponent } from './components/instrucciones-institucion/instrucciones-institucion.component';
import { InstruccionesRoutingModule } from './instrucciones-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    InstruccionesAreaComponent,
    InstruccionesConceptoComponent,
    InstruccionesInstitucionComponent
  ],
  imports: [
    CommonModule,
    InstruccionesRoutingModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ]
})
export class InstruccionesModule { }
