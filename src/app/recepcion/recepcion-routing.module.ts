import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrgenciaComponent } from './components/urgencia/urgencia.component';
import { RecepcionGuard } from '../guards/recepcion.guard';
import { EnviarEstudiosComponent } from './components/enviar-estudios/enviar-estudios.component';
import { EnviarEstudioComponent } from './components/enviar-estudio/enviar-estudio.component';
import { SubirFotoOrdenComponent } from './components/subir-foto-orden/subir-foto-orden.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { AgendarComponent } from './components/agendar/agendar.component';
import { RegistroCompletoPacienteComponent } from './components/registro-completo-paciente/registro-completo-paciente.component';
import { ConfirmarCitaPacienteComponent } from './components/confirmar-cita-paciente/confirmar-cita-paciente.component';
import { ConfirmacionesCitasComponent } from './components/confirmaciones-citas/confirmaciones-citas.component';
import { CheckInComponent } from './components/check-in/check-in.component';
import { PacienteOrdenesComponent } from './components/check-in/paciente-ordenes/paciente-ordenes.component';

const routes: Routes =[
    {
        path: 'urgencia', 
        component: UrgenciaComponent, 
        canActivate : [RecepcionGuard]
      },
      {
        path: 'enviar-estudios', 
        component: EnviarEstudiosComponent, 
        canActivate : [RecepcionGuard]
      },
      {
        path: 'enviar-estudio/:idPacs', 
        component: EnviarEstudioComponent, 
        canActivate : [RecepcionGuard]
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
        path: 'agendar', 
        component: AgendarComponent, 
        canActivate : [RecepcionGuard]
      },
      {
        path: ':idPaciente/:idOrden', 
        component: RegistroCompletoPacienteComponent
      },
      {
        path: 'confirmar/:idOrden/:idPaciente',
        component: ConfirmarCitaPacienteComponent
      },
      {
        path: 'confirmaciones',
        component: ConfirmacionesCitasComponent
      },
      {
        path: 'checkin',
        component:CheckInComponent
      },
      {
        path:"checkin/ver/:idPaciente",
        component:PacienteOrdenesComponent
      },
    { path: "**", redirectTo: ""}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecepcionRoutingModule { }
