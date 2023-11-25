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

@NgModule({
  declarations: [
    PrincipalComponent
    
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
  ]
})
export class InstitucionesModule { }
