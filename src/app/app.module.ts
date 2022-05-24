import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { ConceptosComponent } from './components/conceptos/conceptos.component';
import { LayoutModule } from './layout/layout.module';
import { ConceptosFormComponent } from './components/conceptos/conceptos-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PacientesFormComponent } from './components/pacientes/pacientes-form.component';
import { VentaConceptosComponent } from './components/venta-conceptos/venta-conceptos.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { BuscarEstudioModalComponent } from './components/studies/buscar-estudio-modal/buscar-estudio-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { EnviarEstudioModalComponent } from './components/studies/enviar-estudio-modal/enviar-estudio-modal.component';
import { SubirFotoOrdenComponent } from './components/studies/subir-foto-orden/subir-foto-orden.component';
import { InformacionEstudioModalComponent } from './components/studies/informacion-estudio-modal/informacion-estudio-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AgendaComponent } from './components/agenda/agenda.component';
import { VerAgendadosModalComponent } from './components/agenda/ver-agendados-modal/ver-agendados-modal.component';
import { AntecedentesEstudioModalComponent } from './components/venta-conceptos/antecedentes-estudio-modal/antecedentes-estudio-modal.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MedicoRadiologoComponent } from './components/medico-radiologo/medico-radiologo.component';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    PacientesComponent,
    ConceptosComponent,
    ConceptosFormComponent,
    PacientesFormComponent,
    VentaConceptosComponent,
    BuscarEstudioModalComponent,
    EnviarEstudioModalComponent,
    SubirFotoOrdenComponent,
    InformacionEstudioModalComponent,
    AgendaComponent,
    VerAgendadosModalComponent,
    AntecedentesEstudioModalComponent,
    MedicoRadiologoComponent
  ],
  entryComponents:[
    BuscarEstudioModalComponent,
    EnviarEstudioModalComponent,
    InformacionEstudioModalComponent,
    VerAgendadosModalComponent,
    AntecedentesEstudioModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule, 
    PdfViewerModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
