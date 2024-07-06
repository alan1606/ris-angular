import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CortesRoutingModule } from './cortes-routing.module';
import { TurnosComponent } from './components/turnos/turnos.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { AgregarTurnosModalComponent } from './components/agregar-turnos-modal/agregar-turnos-modal.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PagarOrdenComponent } from './components/pagar-orden/pagar-orden.component';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { FormasPagoComponent } from './components/formas-pago/formas-pago.component';
import { AgregarformasPagoModalComponent } from './components/agregarformas-pago-modal/agregarformas-pago-modal.component';
import { MovimientosCortesComponent } from './components/movimientos-cortes/movimientos-cortes.component';
import { AgregarMovimientoCorteModalComponent } from './components/agregar-movimiento-corte-modal/agregar-movimiento-corte-modal.component';
import { GenerarCorteComponent } from './components/generar-corte/generar-corte.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';
import { DevolucionModalComponent } from './components/devolucion-modal/devolucion-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TurnosComponent,
    AgregarTurnosModalComponent,
    PagarOrdenComponent,
    FormasPagoComponent,
    AgregarformasPagoModalComponent,
    MovimientosCortesComponent,
    AgregarMovimientoCorteModalComponent,
    GenerarCorteComponent,
    DevolucionesComponent,
    DevolucionModalComponent,
  ],
  imports: [
    CommonModule,
    CortesRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    SharedModule,
  ],
  exports: [PagarOrdenComponent],
})
export class CortesModule {}
