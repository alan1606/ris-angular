import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './components/principal/principal.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { ModificarPrecioModalComponent } from './components/modificar-precio-modal/modificar-precio-modal.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreciosRoutingModule } from './precios-routing.module';
import { MatLegacyAutocomplete as MatAutocomplete, MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ConceptosFormComponent } from './components/conceptos-form/conceptos-form.component';



@NgModule({
  declarations: [
    PrincipalComponent,
    ModificarPrecioModalComponent,
    ConceptosFormComponent
  ],
  imports: [
    CommonModule, 
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    PreciosRoutingModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
    ],
  entryComponents: [
    ModificarPrecioModalComponent
  ]
})
export class PreciosModule { }
