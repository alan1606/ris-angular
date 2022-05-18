import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptosFormComponent } from './components/conceptos/conceptos-form.component';
import { ConceptosComponent } from './components/conceptos/conceptos.component';
import { PacientesFormComponent } from './components/pacientes/pacientes-form.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { SubirFotoOrdenComponent } from './components/studies/subir-foto-orden/subir-foto-orden.component';
import { VentaConceptosComponent } from './components/venta-conceptos/venta-conceptos.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { LoginComponent } from './components/usuarios/login/login.component';

const routes: Routes = [
  {path : 'pacientes', component: PacientesComponent},
  {path : 'conceptos', component: ConceptosComponent},
  {path : 'conceptos/form', component: ConceptosFormComponent},
  {path : 'conceptos/form/:id', component: ConceptosFormComponent},
  {path : 'pacientes/form/:id', component: PacientesFormComponent},
  {path : 'pacientes/form', component: PacientesFormComponent},
  {path : 'venta-conceptos', component: VentaConceptosComponent},
  {path : 'subir-foto-orden/:id', component: SubirFotoOrdenComponent},
  {path: 'agenda', component: AgendaComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
