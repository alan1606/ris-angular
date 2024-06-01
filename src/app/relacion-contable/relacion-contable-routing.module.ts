import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelacionEstudiosComponent } from './components/relacion-estudios/relacion-estudios.component';

const routes: Routes = [{ path: '', component: RelacionEstudiosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelacionContableRoutingModule {}
