import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DictadorComponent } from './components/dictador/dictador.component';
import { SubirInterpretacionComponent } from './components/subir-interpretacion/subir-interpretacion.component';
import { DictadorGuard } from '../guards/dictador.guard';

const routes: Routes = [
  {
    path: ':idVentaConcepto',
    component: DictadorComponent,
    canActivate: [DictadorGuard],
  },
  {
    path: 'subir-pdf/:idPacs',
    component: SubirInterpretacionComponent,
    canActivate: [DictadorGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictadorRoutingModule { }
