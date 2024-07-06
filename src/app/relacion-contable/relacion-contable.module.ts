import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelacionContableRoutingModule } from './relacion-contable-routing.module';
import { RelacionEstudiosComponent } from './components/relacion-estudios/relacion-estudios.component';
import { SharedModule } from '../shared/shared.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';

@NgModule({
  declarations: [RelacionEstudiosComponent],
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
