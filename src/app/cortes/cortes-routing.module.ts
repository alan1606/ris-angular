import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnosComponent } from './components/turnos/turnos.component';
import { PagarOrdenComponent } from './components/pagar-orden/pagar-orden.component';
import { RecepcionGuard } from '../guards/recepcion.guard';
import { FormasPagoComponent } from './components/formas-pago/formas-pago.component';

const routes: Routes = [
  {
    path: '',
    component: TurnosComponent,
    canActivate:[RecepcionGuard]
  },
  {
    path:"pagar",
    component:PagarOrdenComponent
  },
  {
    path:"formas-pago",
    component:FormasPagoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CortesRoutingModule {}