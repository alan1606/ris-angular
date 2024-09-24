import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AntecedentesEstudioModalComponent } from './venta-conceptos/antecedentes-estudio-modal/antecedentes-estudio-modal.component';
import { EnviarEstudioDicomComponent } from './venta-conceptos/enviar-estudio-dicom/enviar-estudio-dicom.component';
import { WlPersonalComponent } from './wl-personal/wl-personal.component';
import { VentaConceptosComponent } from './venta-conceptos/venta-conceptos.component';

const routes: Routes = [
  {path: "", component: WlPersonalComponent},
  {path: "secreto", component: VentaConceptosComponent}
];

@NgModule({
  declarations: [
  ],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaConceptosRoutingModule { }
