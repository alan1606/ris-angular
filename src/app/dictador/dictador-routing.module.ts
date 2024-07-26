import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DictadorComponent } from './components/dictador/dictador.component';
import { SubirInterpretacionComponent } from './components/subir-interpretacion/subir-interpretacion.component';
import { DictadorGuard } from '../guards/dictador.guard';
import { ExitGuard } from '../guards/exit.guard';

const routes: Routes = [
  {
    path: ':idVentaConcepto',
    component: DictadorComponent,
    canActivate: [DictadorGuard],
    canDeactivate:[ExitGuard],
    title:"Dictador"
  },
  {
    path: 'subir-pdf/:idPacs',
    component: SubirInterpretacionComponent,
    canActivate: [DictadorGuard],
    title:"Dictador"
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictadorRoutingModule { }
