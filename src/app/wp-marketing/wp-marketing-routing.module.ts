import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnviarCampaniaComponent } from './components/enviar-campania/enviar-campania.component';

const routes: Routes = [
  {path: "enviar", component: EnviarCampaniaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WpMarketingRoutingModule { }
