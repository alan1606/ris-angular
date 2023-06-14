import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearCampaniaComponent } from './components/crear-campania/crear-campania.component';
import { VerCampaniasComponent } from './components/ver-campanias/ver-campanias.component';

const routes: Routes =[
    { path: "", component: VerCampaniasComponent},
    { path: "form", component: CrearCampaniaComponent},
    { path: "form/:id", component: VerCampaniasComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CampaniasRoutingModule { }
