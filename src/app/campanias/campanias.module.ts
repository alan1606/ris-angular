import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearCampaniaComponent } from './components/crear-campania/crear-campania.component';
import { VerCampaniasComponent } from './components/ver-campanias/ver-campanias.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CampaniasRoutingModule } from './campanias-routing.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { DetallesCampaniaModalComponent } from './components/detalles-campania-modal/detalles-campania-modal.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
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
