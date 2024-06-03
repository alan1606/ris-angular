import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelacionEstudiosComponent } from './components/relacion-estudios/relacion-estudios.component';
import { AdminGuard } from '../guards/admin.guard';
import { RelacionContableGuard } from '../guards/relacion-contable.guard';

const routes: Routes = [{ path: '', component: RelacionEstudiosComponent, canActivate:[RelacionContableGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelacionContableRoutingModule {}
