import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorMedicosReferentesComponent } from './components/buscador-medicos-referentes/buscador-medicos-referentes.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BuscadorAreasComponent } from './components/buscador-areas/buscador-areas.component';
import { BuscadorSalaComponent } from './components/buscador-sala/buscador-sala.component';

@NgModule({
  declarations: [BuscadorMedicosReferentesComponent, BuscadorAreasComponent, BuscadorSalaComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
  ],
  exports: [BuscadorMedicosReferentesComponent, BuscadorAreasComponent, BuscadorSalaComponent],
})
export class SharedModule {}
