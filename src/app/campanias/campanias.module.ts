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
import { MatDialogModule } from '@angular/material/dialog';
import { DetallesCampaniaModalComponent } from './components/detalles-campania-modal/detalles-campania-modal.component';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ObtenerCodigoComponent } from './components/obtener-codigo/obtener-codigo.component';
import { DesuscribirComponent } from './components/desuscribir/desuscribir.component';



@NgModule({
  declarations: [
    CrearCampaniaComponent,
    VerCampaniasComponent,
    DetallesCampaniaModalComponent,
    ObtenerCodigoComponent,
    DesuscribirComponent
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
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    MatAutocompleteModule
  ],
  entryComponents: [
    DetallesCampaniaModalComponent
  ]
})
export class CampaniasModule { }
