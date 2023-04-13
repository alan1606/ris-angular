import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptosFormComponent } from './components/conceptos/conceptos-form.component';
import { ConceptosComponent } from './components/conceptos/conceptos.component';
import { PacientesFormComponent } from './components/pacientes/pacientes-form.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { SubirFotoOrdenComponent } from './components/studies/subir-foto-orden/subir-foto-orden.component';
import { VentaConceptosComponent } from './components/venta-conceptos/venta-conceptos.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { MedicoRadiologoComponent } from './components/medico-radiologo/medico-radiologo.component';
import { DictadorComponent } from './components/dictador/dictador.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { DictamenComponent } from './components/resultados/dictamen.component';
import { EnviarEstudiosComponent } from './components/recepcion/enviar-estudios/enviar-estudios.component';
import { EnviarEstudioComponent } from './components/recepcion/enviar-estudio.component';
import { WorklistComponent } from './components/worklist/worklist.component';
import { SubirInterpretacionComponent } from './components/dictador/subir-interpretacion/subir-interpretacion.component';
import { OrdenVentaComponent } from './components/resultados/orden-venta.component';
import { AgendarCitaComponent } from './modules/recepcion/agendar-cita/agendar-cita.component';



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
  {path: 'medico-radiologo/:token', component: MedicoRadiologoComponent},
  {path: 'dictador/:idVentaConcepto', component: DictadorComponent},
  {path: 'resultados/:idPacs', component: ResultadosComponent},
  {path: 'dictamen/:idPacs', component: DictamenComponent},
  {path: 'recepcion/enviar-estudios', component: EnviarEstudiosComponent},
  {path: 'recepcion/enviar-estudio/:idPacs', component: EnviarEstudioComponent},
  {path: 'worklist', component: WorklistComponent},
  {path: 'dictador/subir-pdf/:idPacs', component: SubirInterpretacionComponent},
  {path: 'resultados/orden/:ordenId/:pacienteId', component: OrdenVentaComponent},
  {path: 'recepcion/agendar-cita', component: AgendarCitaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
