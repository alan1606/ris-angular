import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurneroComponent } from './components/turnero/turnero.component';

const routes: Routes = [
  {
    path:"",
    component:TurneroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurneroRoutingModule { }
