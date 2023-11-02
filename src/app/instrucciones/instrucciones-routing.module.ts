import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InstruccionesAreaComponent } from "./components/instrucciones-area/instrucciones-area.component";
import { InstruccionesInstitucionComponent } from "./components/instrucciones-institucion/instrucciones-institucion.component";
import { InstruccionesConceptoComponent } from "./components/instrucciones-concepto/instrucciones-concepto.component";

const routes: Routes =[
    { path: "", component: InstruccionesConceptoComponent},
    { path: "area", component: InstruccionesAreaComponent},
    { path: "institucion", component: InstruccionesInstitucionComponent},
    { path: "concepto", component: InstruccionesConceptoComponent},
    { path: "**", redirectTo: ""}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InstruccionesRoutingModule {
}
