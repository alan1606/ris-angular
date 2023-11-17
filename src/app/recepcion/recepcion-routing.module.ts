import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrgenciaComponent } from './components/agendar-cita/urgencia.component';
import { RecepcionGuard } from '../guards/recepcion.guard';
import { EnviarEstudiosComponent } from './components/enviar-estudios/enviar-estudios.component';
import { EnviarEstudioComponent } from './components/enviar-estudio/enviar-estudio.component';
import { SubirFotoOrdenComponent } from './components/subir-foto-orden/subir-foto-orden.component';
import { AgendaComponent } from './components/agenda/agenda.component';

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
    { path: "**", redirectTo: ""}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecepcionRoutingModule { }
