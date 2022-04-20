import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptosFormComponent } from './components/conceptos/conceptos-form.component';
import { ConceptosComponent } from './components/conceptos/conceptos.component';
import { PacientesFormComponent } from './components/pacientes/pacientes-form.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';

const routes: Routes = [
  {path : 'pacientes', component: PacientesComponent},
  {path : 'conceptos', component: ConceptosComponent},
  {path : 'conceptos/form', component: ConceptosFormComponent},
  {path : 'conceptos/form/:id', component: ConceptosFormComponent},
  {path : 'pacientes/form/:id', component: PacientesFormComponent},
  {path : 'pacientes/form', component: PacientesFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
