import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadosRoutingModule } from './resultados-routing.module';
import { DictamenComponent } from './components/dictamen/dictamen.component';
import { OrdenVentaComponent } from './components/orden-venta/orden-venta.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { BuscarPorOrdenYPacienteComponent } from './components/buscar-por-orden-ypaciente/buscar-por-orden-ypaciente.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
import { MatButtonModule } from '@angular/material/button';

LOAD_WASM().subscribe();

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
    NgxExtendedPdfViewerModule,
    NgxScannerQrcodeModule,
    MatButtonModule,
  ],
})
export class ResultadosModule {}
