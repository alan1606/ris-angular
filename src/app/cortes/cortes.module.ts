import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CortesRoutingModule } from './cortes-routing.module';
import { TurnosComponent } from './components/turnos/turnos.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AgregarTurnosModalComponent } from './components/agregar-turnos-modal/agregar-turnos-modal.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PagarOrdenComponent } from './components/pagar-orden/pagar-orden.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormasPagoComponent } from './components/formas-pago/formas-pago.component';
import { AgregarformasPagoModalComponent } from './components/agregarformas-pago-modal/agregarformas-pago-modal.component';
import { MovimientosCortesComponent } from './components/movimientos-cortes/movimientos-cortes.component';
import { AgregarMovimientoCorteModalComponent } from './components/agregar-movimiento-corte-modal/agregar-movimiento-corte-modal.component';

@NgModule({
  declarations: [
    TurnosComponent,
    AgregarTurnosModalComponent,
    PagarOrdenComponent,
    FormasPagoComponent,
    AgregarformasPagoModalComponent,
    MovimientosCortesComponent,
    AgregarMovimientoCorteModalComponent,
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
    FormsModule,
    HttpClientModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
})
export class CortesModule {}
