import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WpMarketingRoutingModule } from './wp-marketing-routing.module';
import { EnviarCampaniaComponent } from './components/enviar-campania/enviar-campania.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EnviarCampaniaComponent
  ],
  imports: [
    CommonModule,
    WpMarketingRoutingModule,
    FormsModule
  ]
})
export class WpMarketingModule { }
