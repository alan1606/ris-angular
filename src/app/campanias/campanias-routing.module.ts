import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearCampaniaComponent } from './components/crear-campania/crear-campania.component';
import { VerCampaniasComponent } from './components/ver-campanias/ver-campanias.component';
import { AdminGuard } from '../guards/admin.guard';
import { ObtenerCodigoComponent } from './components/obtener-codigo/obtener-codigo.component';

const routes: Routes =[
    { path: "", component: VerCampaniasComponent, canActivate: [AdminGuard]},
    { path: "form", component: CrearCampaniaComponent, canActivate: [AdminGuard]},
    { path: "form/:id", component: CrearCampaniaComponent, canActivate: [AdminGuard]},
    { path: "obtener-codigo/:codigoBase", component: ObtenerCodigoComponent},
    { path: "**", redirectTo: ""}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CampaniasRoutingModule { }
