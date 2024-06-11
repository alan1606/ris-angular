import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorMedicosReferentesComponent } from './components/buscador-medicos-referentes/buscador-medicos-referentes.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BuscadorAreasComponent } from './components/buscador-areas/buscador-areas.component';
import { BuscadorSalaComponent } from './components/buscador-sala/buscador-sala.component';
import { MatSelectModule } from '@angular/material/select';
import { CampoFechaComponent } from './components/campo-fecha/campo-fecha.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CampoFechaRangoComponent } from './components/campo-fecha-rango/campo-fecha-rango.component';
import { RenderImagenComponent } from './components/render-imagen/render-imagen.component';
import { QuillModule } from 'ngx-quill';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    BuscadorMedicosReferentesComponent,
    BuscadorAreasComponent,
    BuscadorSalaComponent,
    CampoFechaComponent,
    CampoFechaRangoComponent,
    RenderImagenComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    QuillModule.forRoot(),
    PdfViewerModule,
  ],
  exports: [
    BuscadorMedicosReferentesComponent,
    BuscadorAreasComponent,
    BuscadorSalaComponent,
    CampoFechaComponent,
    CampoFechaRangoComponent,
    RenderImagenComponent,
  ],
})
export class SharedModule {}
