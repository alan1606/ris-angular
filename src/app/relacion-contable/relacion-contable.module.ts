import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelacionContableRoutingModule } from './relacion-contable-routing.module';
import { RelacionEstudiosComponent } from './components/relacion-estudios/relacion-estudios.component';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RelacionContableComponent } from './components/relacion-contable/relacion-contable.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [RelacionEstudiosComponent, RelacionContableComponent],
  imports: [
    CommonModule,
    RelacionContableRoutingModule,
    SharedModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
})
export class RelacionContableModule {}
