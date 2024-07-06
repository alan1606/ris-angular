import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorMedicosReferentesComponent } from './components/buscador-medicos-referentes/buscador-medicos-referentes.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BuscadorAreasComponent } from './components/buscador-areas/buscador-areas.component';
import { BuscadorSalaComponent } from './components/buscador-sala/buscador-sala.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
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
