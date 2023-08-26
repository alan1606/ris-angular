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
import { AgendarCitaComponent } from './modules/recepcion/components/agendar-cita/agendar-cita.component';
import { LoginComponent } from './components/usuarios/login/login.component';
import { AuthorizedComponent } from './components/authorized/authorized.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ConceptosGuard } from './guards/conceptos.guard';
import { VentaConceptosGuard } from './guards/venta-conceptos.guard';
import { RecepcionGuard } from './guards/recepcion.guard';
import { DictadorGuard } from './guards/dictador.guard';
import { AnyRoleGuard } from './guards/any-role.guard';
import { AdminGuard } from './guards/admin.guard';


const routes: Routes = [
  //{path : 'pacientes', component: PacientesComponent},
  {
    path : 'conceptos', 
    component: ConceptosComponent, 
    canActivate : [ConceptosGuard]
  },
  {
    path : 'conceptos/form', 
    component: ConceptosFormComponent, 
    canActivate : [ConceptosGuard]
  },
  {
    path : 'conceptos/form/:id', 
    component: ConceptosFormComponent, 
    canActivate : [ConceptosGuard]
  },
  //{path : 'pacientes/form/:id', component: PacientesFormComponent},
  //{path : 'pacientes/form', component: PacientesFormComponent},

  {
    path : 'venta-conceptos', 
    component: VentaConceptosComponent, 
    canActivate : [VentaConceptosGuard]
  },
  {
    path : 'subir-foto-orden/:id', 
    component: SubirFotoOrdenComponent, 
    canActivate : [RecepcionGuard]
  },
  {
    path: 'agenda', 
    component: AgendaComponent, 
    canActivate : [RecepcionGuard]
  },
  {
    path: 'medico-radiologo', 
    component: MedicoRadiologoComponent, 
    canActivate : [DictadorGuard]
  },
  {
    path: 'medico-radiologo/:token', 
    component: MedicoRadiologoComponent, 
    canActivate : [DictadorGuard]
  },
  {
    path: 'dictador/:idVentaConcepto', 
    component: DictadorComponent, 
    canActivate : [DictadorGuard]
  },
  {
    path: 'resultados/:idPacs', 
    component: ResultadosComponent, 
    canActivate : []
  },
  {
    path: 'dictamen/:idPacs',
     component: DictamenComponent, 
     canActivate : []
  },
  {
    path: 'recepcion/enviar-estudios', 
    component: EnviarEstudiosComponent, 
    canActivate : [RecepcionGuard]
  },
  {
    path: 'recepcion/enviar-estudio/:idPacs', 
    component: EnviarEstudioComponent, 
    canActivate : [RecepcionGuard]
  },
  {
    path: 'worklist', 
    component: WorklistComponent, 
    canActivate : [VentaConceptosGuard]
  },
  {
    path: 'dictador/subir-pdf/:idPacs', 
    component: SubirInterpretacionComponent, 
    canActivate : [DictadorGuard]
  },
  {
    path: 'resultados/orden/:ordenId/:pacienteId', 
    component: OrdenVentaComponent, 
    canActivate : []
  },
  {
    path: 'recepcion/agendar-cita', 
    component: AgendarCitaComponent, 
    canActivate : [RecepcionGuard]
  },
  {
    path: 'campanias', 
      loadChildren: () => import('./campanias/campanias.module').then( m => m.CampaniasModule),
      canActivate : [ AdminGuard ] 
  },
  {
    path: 'precios', 
      loadChildren: () => import('./precios/precios.module').then( m => m.PreciosModule),
      canActivate : [ AdminGuard ] 
  },
  {
    path: 'authorized', 
    component: AuthorizedComponent, 
    canActivate : []
  },
  {
    path: 'logout', 
    component: LogoutComponent, 
    canActivate : [AnyRoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
