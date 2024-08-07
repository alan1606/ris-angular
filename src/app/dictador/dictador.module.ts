import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictadorRoutingModule } from './dictador-routing.module';
import { VisorInterpretacionComponent } from './components/visor-interpretacion/visor-interpretacion.component';
import { DictadorComponent } from './components/dictador/dictador.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { SubirInterpretacionComponent } from './components/subir-interpretacion/subir-interpretacion.component';
import { BuscarMedicoReferenteYCambiarComponent } from './components/buscar-medico-referente-ycambiar/buscar-medico-referente-ycambiar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [
    VisorInterpretacionComponent,
    DictadorComponent,
    SubirInterpretacionComponent,
    BuscarMedicoReferenteYCambiarComponent,
  ],
  imports: [
    CommonModule,
    DictadorRoutingModule,
    MatToolbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    QuillModule,
    NgxExtendedPdfViewerModule
  ],
  exports:[VisorInterpretacionComponent]
})
export class DictadorModule {}
