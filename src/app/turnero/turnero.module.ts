import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurneroRoutingModule } from './turnero-routing.module';
import { TurneroComponent } from './components/turnero/turnero.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [TurneroComponent],
  imports: [CommonModule, TurneroRoutingModule, SharedModule, MatButtonModule, MatTableModule, MatExpansionModule],
})
export class TurneroModule {}
