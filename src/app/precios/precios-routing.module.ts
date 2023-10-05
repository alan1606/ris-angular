import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { ConceptosFormComponent } from './components/conceptos-form/conceptos-form.component';

const routes: Routes =[
    { path: "", component: PrincipalComponent},
    {
        path : 'conceptos/form', 
        component: ConceptosFormComponent
      },
      {
        path : 'conceptos/form/:id', 
        component: ConceptosFormComponent
      },
    { path: "**", redirectTo: ""},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PreciosRoutingModule { }
