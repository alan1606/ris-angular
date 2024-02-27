import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadosRoutingModule } from './resultados-routing.module';
import { DictamenComponent } from './components/dictamen/dictamen.component';
import { OrdenVentaComponent } from './components/orden-venta/orden-venta.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { BuscarPorOrdenYPacienteComponent } from './components/buscar-por-orden-ypaciente/buscar-por-orden-ypaciente.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    DictamenComponent,
    OrdenVentaComponent,
    ResultadosComponent,
    BuscarPorOrdenYPacienteComponent,
  ],
  imports: [
    CommonModule,
    ResultadosRoutingModule,
    FormsModule,
    MatCardModule,
    PdfViewerModule
  ]
})
export class ResultadosModule { }
