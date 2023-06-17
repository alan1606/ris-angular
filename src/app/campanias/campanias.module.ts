import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearCampaniaComponent } from './components/crear-campania/crear-campania.component';
import { VerCampaniasComponent } from './components/ver-campanias/ver-campanias.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CampaniasRoutingModule } from './campanias-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    CrearCampaniaComponent,
    VerCampaniasComponent
  ],
  imports: [
    CommonModule,
    CampaniasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSelectModule
  ]
})
export class CampaniasModule { }
