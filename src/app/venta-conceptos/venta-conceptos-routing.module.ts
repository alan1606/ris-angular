import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WlPersonalComponent } from './wl-personal/wl-personal.component';
import { VentaConceptosComponent } from './venta-conceptos/venta-conceptos.component';
import { OnlyRecepcionGuard } from '../guards/only-recepcion.guard';

const routes: Routes = [
  {path: "", component: WlPersonalComponent},
  {path: "secreto", component: VentaConceptosComponent, canActivate: [OnlyRecepcionGuard]}
];

@NgModule({
  declarations: [
  ],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaConceptosRoutingModule { }
