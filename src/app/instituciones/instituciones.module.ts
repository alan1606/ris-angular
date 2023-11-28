import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitucionesRoutingModule } from './instituciones-routing.module';
import { PrincipalComponent } from './components/principal/principal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { EnviarResultadosComponent } from './components/enviar-resultados/enviar-resultados.component';
import { RegistrarMedicoModalComponent } from "./components/enviar-resultados/registrar-medico-modal/registrar-medico-modal.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    PrincipalComponent,
    EnviarResultadosComponent,
    RegistrarMedicoModalComponent
    
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
    MatAutocompleteModule
  ]
})
export class InstitucionesModule { }
