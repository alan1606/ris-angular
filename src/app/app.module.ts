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
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import { MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import { BuscarEstudioModalComponent } from './components/studies/buscar-estudio-modal/buscar-estudio-modal.component';
import { MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import { EnviarEstudioModalComponent } from './components/studies/enviar-estudio-modal/enviar-estudio-modal.component';
import { SubirFotoOrdenComponent } from './components/studies/subir-foto-orden/subir-foto-orden.component';
import { InformacionEstudioModalComponent } from './components/studies/informacion-estudio-modal/informacion-estudio-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AgendaComponent } from './components/agenda/agenda.component';
import { VerAgendadosModalComponent } from './components/agenda/ver-agendados-modal/ver-agendados-modal.component';
import { AntecedentesEstudioModalComponent } from './components/venta-conceptos/antecedentes-estudio-modal/antecedentes-estudio-modal.component';
import { MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import { MedicoRadiologoComponent } from './components/medico-radiologo/medico-radiologo.component';
import { DictadorComponent } from './components/dictador/dictador.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import  {QRCodeModule}  from 'angular2-qrcode';
import { DictamenComponent } from './components/resultados/dictamen.component';
import { EnviarEstudiosComponent } from './components/recepcion/enviar-estudios/enviar-estudios.component';
import { EnviarEstudioComponent } from './components/recepcion/enviar-estudio.component';
import { WorklistComponent } from './components/worklist/worklist.component';
import { SubirInterpretacionComponent } from './components/dictador/subir-interpretacion/subir-interpretacion.component';
import { OrdenVentaComponent } from './components/resultados/orden-venta.component';
import { RecepcionModule } from './modules/recepcion/recepcion.module';
import { LoginComponent } from './components/usuarios/login/login.component';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';


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
        MedicoRadiologoComponent,
        DictadorComponent,
        ResultadosComponent,
        DictamenComponent,
        EnviarEstudiosComponent,
        EnviarEstudioComponent,
        WorklistComponent,
        SubirInterpretacionComponent,
        OrdenVentaComponent,
        LoginComponent
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
        MatSelectModule,
        MatIconModule,
        MatCardModule,
        QRCodeModule,
        RecepcionModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule
    ],
    providers: [
        DatePipe,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
