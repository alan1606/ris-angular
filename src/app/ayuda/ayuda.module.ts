import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { AyudaRoutingModule } from './ayuda-routing.module';
import { AyudaComponent } from './components/ayuda/ayuda.component';


@NgModule({
  declarations: [AyudaComponent],
  imports: [CommonModule, AyudaRoutingModule, MatExpansionModule],
})
export class AyudaModule {}
