import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurneroRoutingModule } from './turnero-routing.module';
import { TurneroComponent } from './components/turnero/turnero.component';

@NgModule({
  declarations: [TurneroComponent],
  imports: [CommonModule, TurneroRoutingModule],
})
export class TurneroModule {}
