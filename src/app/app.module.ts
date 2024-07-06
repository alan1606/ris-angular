import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { ConceptosComponent } from './components/conceptos/conceptos.component';
import { LayoutModule } from './layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PacientesFormComponent } from './components/pacientes/pacientes-form.component';
import { VentaConceptosComponent } from './components/venta-conceptos/venta-conceptos.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { BuscarEstudioModalComponent } from './components/studies/buscar-estudio-modal/buscar-estudio-modal.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { EnviarEstudioModalComponent } from './components/studies/enviar-estudio-modal/enviar-estudio-modal.component';
import { InformacionEstudioModalComponent } from './components/studies/informacion-estudio-modal/informacion-estudio-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AntecedentesEstudioModalComponent } from './components/venta-conceptos/antecedentes-estudio-modal/antecedentes-estudio-modal.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MedicoRadiologoComponent } from './components/medico-radiologo/medico-radiologo.component';
import { WorklistComponent } from './components/worklist/worklist.component';
import { LoginComponent } from './components/usuarios/login/login.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { QuillModule } from 'ngx-quill';
import { AuthorizedComponent } from './components/authorized/authorized.component';
import { ResourceInterceptor } from './interceptors/resource.interceptor';
import { LogoutComponent } from './components/logout/logout.component';
import { RecepcionModule } from './recepcion/recepcion.module';
import { CrudMedicosComponent } from './components/crud-medicos/crud-medicos.component';
import { FormularioMedicosComponent } from './components/crud-medicos/formulario-medicos/formulario-medicos.component';
import { NuevoMedicoSoloNombreComponent } from './components/studies/nuevo-medico-solo-nombre/nuevo-medico-solo-nombre.component';
import { BuscadorPacientesComponent } from './components/buscador-pacientes/buscador-pacientes.component';
import { QrFirmarPoliticasMembresiaComponent } from './components/qr-firmar-politicas-membresia/qr-firmar-politicas-membresia.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { AyudaModule } from './ayuda/ayuda.module';
import { ChatModule } from './chat/chat.module';
import { MembresiasComponent } from './components/membresias/membresias.component';
import { CrudPacientesComponent } from './components/crud-pacientes/crud-pacientes.component';
import { LandingMembresiaComponent } from './components/landing-membresia/landing-membresia.component';
import { PerfilModule } from './perfil/perfil.module';
import { FirmarMembresiaComponent } from './components/membresias/firmar-membresia/firmar-membresia.component';
import { SharedModule } from './shared/shared.module';
import { CortesModule } from './cortes/cortes.module';
import { EnviarEstudioDicomComponent } from './components/venta-conceptos/enviar-estudio-dicom/enviar-estudio-dicom.component';


@NgModule({
  declarations: [
    AppComponent,
    PacientesComponent,
    ConceptosComponent,
    PacientesFormComponent,
    VentaConceptosComponent,
    BuscarEstudioModalComponent,
    EnviarEstudioModalComponent,
    InformacionEstudioModalComponent,
    AntecedentesEstudioModalComponent,
    MedicoRadiologoComponent,
    WorklistComponent,
    LoginComponent,
    AuthorizedComponent,
    LogoutComponent,
    CrudMedicosComponent,
    FormularioMedicosComponent,
    NuevoMedicoSoloNombreComponent,
    BuscadorPacientesComponent,
    QrFirmarPoliticasMembresiaComponent,
    MembresiasComponent,
    CrudPacientesComponent,
    LandingMembresiaComponent,
    FirmarMembresiaComponent,
    EnviarEstudioDicomComponent,
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
    NgxQRCodeModule,
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
    RecepcionModule,
    MatDividerModule,
    MatFormFieldModule,
    AyudaModule,
    ChatModule,
    PerfilModule,
    SharedModule,
    QuillModule.forRoot(),
    CortesModule,

  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: HTTP_INTERCEPTORS, useClass: ResourceInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
