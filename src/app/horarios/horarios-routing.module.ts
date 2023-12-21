import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { HorarioFormComponent } from './components/horario-form/horario-form.component';
import { ApartarDiasComponent } from './components/apartar-dias/apartar-dias.component';

const routes: Routes = [
  {path: "", component: PrincipalComponent},
  {path: "form", component: HorarioFormComponent},
  {path: "form/:id", component: HorarioFormComponent},
  {path: "descanso", component: ApartarDiasComponent},
  {path: "**", redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorariosRoutingModule { }
