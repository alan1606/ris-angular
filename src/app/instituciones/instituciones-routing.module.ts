import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { EnviarResultadosComponent } from './components/enviar-resultados/enviar-resultados.component';


const routes: Routes = [
  {
    path:"",component:PrincipalComponent
  },
  {path:"enviar/:ordenId",component:EnviarResultadosComponent},
  {path: "**", redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionesRoutingModule { }
