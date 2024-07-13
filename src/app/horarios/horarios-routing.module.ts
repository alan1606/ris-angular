import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { HorarioFormComponent } from './components/horario-form/horario-form.component';
import { ApartarDiasComponent } from './components/apartar-dias/apartar-dias.component';
import { ApartarHorasComponent } from './components/apartar-horas/apartar-horas.component';
import { LimitarInstitucionPorSalaComponent } from './components/limitar-institucion-por-sala/limitar-institucion-por-sala.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'form', component: HorarioFormComponent },
  { path: 'form/:id', component: HorarioFormComponent },
  { path: 'descanso', component: ApartarDiasComponent },
  { path: 'descanso/horas', component: ApartarHorasComponent },
  { path: 'limitar', component: LimitarInstitucionPorSalaComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorariosRoutingModule {}
