import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptosComponent } from './components/conceptos/conceptos.component';
import { MedicoRadiologoComponent } from './components/medico-radiologo/medico-radiologo.component';
import { DictamenComponent } from './resultados/components/dictamen/dictamen.component';
import { WorklistComponent } from './components/worklist/worklist.component';
import { AuthorizedComponent } from './components/authorized/authorized.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ConceptosGuard } from './guards/conceptos.guard';
import { VentaConceptosGuard } from './guards/venta-conceptos.guard';
import { RecepcionGuard } from './guards/recepcion.guard';
import { DictadorGuard } from './guards/dictador.guard';
import { AnyRoleGuard } from './guards/any-role.guard';
import { AdminGuard } from './guards/admin.guard';
import { InstitucionGuard } from './guards/institucion.guard';
import { CrudMedicosComponent } from './components/crud-medicos/crud-medicos.component';
import { MedicosGuard } from './guards/medicos.guard';
import { MembresiasComponent } from './components/membresias/membresias.component';
import { CrudPacientesComponent } from './components/crud-pacientes/crud-pacientes.component';
import { LandingMembresiaComponent } from './components/landing-membresia/landing-membresia.component';
import { FirmarMembresiaComponent } from './components/membresias/firmar-membresia/firmar-membresia.component';
import { TurneroGuard } from './guards/turnero.guard';

const routes: Routes = [
  {
    path: 'conceptos',
    component: ConceptosComponent,
    canActivate: [ConceptosGuard],
  },
  {
    path: 'medico-radiologo',
    component: MedicoRadiologoComponent,
    canActivate: [DictadorGuard],
    title: 'RIS',
  },
  {
    path: 'medico-radiologo/:token',
    component: MedicoRadiologoComponent,
    canActivate: [DictadorGuard],
  },
  {
    path: 'dictador',
    loadChildren: () =>
      import('./dictador/dictador.module').then((m) => m.DictadorModule),
    canActivate: [DictadorGuard],
  },
  {
    path: 'dictamen/:idPacs',
    component: DictamenComponent,
    canActivate: [],
  },
  {
    path: 'worklist',
    component: WorklistComponent,
    canActivate: [VentaConceptosGuard],
  },
  {
    path: 'campanias',
    loadChildren: () =>
      import('./campanias/campanias.module').then((m) => m.CampaniasModule),
  },
  {
    path: 'venta-conceptos',
    loadChildren: () =>
      import('./venta-conceptos/venta-conceptos.module').then((m) => m.VentaConceptosModule),
    canActivate: [VentaConceptosGuard],
  },
  {
    path: 'precios',
    loadChildren: () =>
      import('./precios/precios.module').then((m) => m.PreciosModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'instrucciones',
    loadChildren: () =>
      import('./instrucciones/instrucciones.module').then(
        (m) => m.InstruccionesModule
      ),
    canActivate: [AdminGuard],
  },
  {
    path: 'horarios',
    loadChildren: () =>
      import('./horarios/horarios.module').then((m) => m.HorariosModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'recepcion',
    loadChildren: () =>
      import('./recepcion/recepcion.module').then((m) => m.RecepcionModule),
  },
  {
    path: 'authorized',
    component: AuthorizedComponent,
    canActivate: [],
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AnyRoleGuard],
  },
  {
    path: 'instituciones',
    loadChildren: () =>
      import('./instituciones/instituciones.module').then(
        (m) => m.InstitucionesModule
      ),
    canActivate: [InstitucionGuard],
  },
  {
    path: 'medicos',
    component: CrudMedicosComponent,
    canActivate: [MedicosGuard],
  },
  {
    path: 'membresias',
    component: MembresiasComponent,
    canActivate: [RecepcionGuard],
  },
  {
    path: 'membresias/firmar/:idPaciente/:nombrePaciente/:codigoMembresia',
    component: FirmarMembresiaComponent,
    canActivate: [RecepcionGuard],
  },
  {
    path: 'medico-referente',
    loadChildren: () =>
      import('./medicos-referentes/medicos-referentes.module').then(
        (m) => m.MedicosReferentesModule
      ),
  },
  {
    path: 'ayuda',
    loadChildren: () =>
      import('./ayuda/ayuda.module').then((m) => m.AyudaModule),
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
    canActivate: [RecepcionGuard],
  },
  {
    path: 'resultados',
    loadChildren: () =>
      import('./resultados/resultados.module').then((m) => m.ResultadosModule),
  },
  {
    path: 'wp-marketing',
    loadChildren: () =>
      import('./wp-marketing/wp-marketing.module').then(
        (m) => m.WpMarketingModule
      ),
    canActivate: [AdminGuard],
  },
  {
    path: 'pacientes',
    component: CrudPacientesComponent,
    canActivate: [RecepcionGuard],
  },
  {
    path: 'membresia-landing',
    component: LandingMembresiaComponent,
  },

  {
    path: 'cortes',
    loadChildren: () =>
      import('./cortes/cortes.module').then((m) => m.CortesModule),
  },
  {
    path: 'relacion-estudios',
    loadChildren: () =>
      import('./relacion-contable/relacion-contable.module').then(
        (m) => m.RelacionContableModule
      ),
  },
  {
    path: 'turnero',
    loadChildren: () =>
      import('./turnero/turnero.module').then((m) => m.TurneroModule),
    canActivate: [TurneroGuard],
  },
  {
    path: 'pantallas',
    loadChildren: () =>
      import('./pantallas/pantallas.module').then((m) => m.PantallasModule),
  },
  {
    path: '',
    redirectTo: 'resultados',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
