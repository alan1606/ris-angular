import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitucionesRoutingModule } from './instituciones-routing.module';
import { PrincipalComponent } from './components/principal/principal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { EnviarResultadosComponent } from './components/enviar-resultados/enviar-resultados.component';
import { RegistrarMedicoModalComponent } from "./components/enviar-resultados/registrar-medico-modal/registrar-medico-modal.component";
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SeleccionarInstitucionComponent } from './components/seleccionar-institucion/seleccionar-institucion.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

@NgModule({
  declarations: [
    PrincipalComponent,
    EnviarResultadosComponent,
    RegistrarMedicoModalComponent,
    SeleccionarInstitucionComponent
    
  ],
  imports: [
    CommonModule,
    InstitucionesRoutingModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule
  ]
})
export class InstitucionesModule { }
