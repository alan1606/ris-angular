import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncolaComponent } from './components/encola/encola.component';

const routes: Routes = [
  {
    path: '',
    component: EncolaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncolaRoutingModule {}
