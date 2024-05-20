import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnosComponent } from './components/turnos/turnos.component';
import { PagarOrdenComponent } from './components/pagar-orden/pagar-orden.component';
import { RecepcionGuard } from '../guards/recepcion.guard';
import { FormasPagoComponent } from './components/formas-pago/formas-pago.component';
import { MovimientosCortesComponent } from './components/movimientos-cortes/movimientos-cortes.component';
import { GenerarCorteComponent } from './components/generar-corte/generar-corte.component';

const routes: Routes = [
  {
    path: '',
    component: TurnosComponent,
    canActivate: [RecepcionGuard],
  },
  {
    path: 'formas-pago',
    component: FormasPagoComponent,
  },
  {
    path: 'movimientos-cortes',
    component: MovimientosCortesComponent,
  },
  {
    path: 'generar',
    component: GenerarCorteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CortesRoutingModule {}
