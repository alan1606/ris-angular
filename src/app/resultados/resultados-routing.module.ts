import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { OrdenVentaComponent } from './components/orden-venta/orden-venta.component';
import { BuscarPorOrdenYPacienteComponent } from './components/buscar-por-orden-ypaciente/buscar-por-orden-ypaciente.component';

const routes: Routes = [
  {
    path: "",
    component: BuscarPorOrdenYPacienteComponent
  },
  {
    path: ':idPacs',
    component: ResultadosComponent,
    canActivate: [],
  },
  {
    path: 'orden/:ordenId/:pacienteId',
    component: OrdenVentaComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultadosRoutingModule { }
