import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PantallasComponent } from './components/pantallas/pantallas.component';
import { VerPantallasComponent } from './components/ver-pantallas/ver-pantallas.component';

const routes: Routes = [
  {
    path: '',
    component: PantallasComponent,
  },
  {
    path: 'ver',
    component: VerPantallasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PantallasRoutingModule {}
