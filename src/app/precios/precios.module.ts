import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrincipalComponent } from './components/principal/principal.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ModificarPrecioModalComponent } from './components/modificar-precio-modal/modificar-precio-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreciosRoutingModule } from './precios-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
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
})
export class PreciosModule { }
