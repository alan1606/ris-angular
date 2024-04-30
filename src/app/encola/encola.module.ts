import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncolaRoutingModule } from './encola-routing.module';
import { EncolaComponent } from './components/encola/encola.component';

@NgModule({
  declarations: [
    EncolaComponent
  ],
  imports: [
    CommonModule,
    EncolaRoutingModule,
    
  ]
})
export class EncolaModule { }
