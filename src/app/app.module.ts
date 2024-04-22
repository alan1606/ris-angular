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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BuscarEstudioModalComponent } from './components/studies/buscar-estudio-modal/buscar-estudio-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EnviarEstudioModalComponent } from './components/studies/enviar-estudio-modal/enviar-estudio-modal.component';
import { InformacionEstudioModalComponent } from './components/studies/informacion-estudio-modal/informacion-estudio-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AntecedentesEstudioModalComponent } from './components/venta-conceptos/antecedentes-estudio-modal/antecedentes-estudio-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MedicoRadiologoComponent } from './components/medico-radiologo/medico-radiologo.component';
import { DictadorComponent } from './components/dictador/dictador.component';
import { WorklistComponent } from './components/worklist/worklist.component';
import { SubirInterpretacionComponent } from './components/dictador/subir-interpretacion/subir-interpretacion.component';
import { LoginComponent } from './components/usuarios/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QuillModule } from 'ngx-quill';
import { AuthorizedComponent } from './components/authorized/authorized.component';
import { ResourceInterceptor } from './interceptors/resource.interceptor';
import { LogoutComponent } from './components/logout/logout.component';
import { RecepcionModule } from './recepcion/recepcion.module';
import { CrudMedicosComponent } from './components/crud-medicos/crud-medicos.component';
import { FormularioMedicosComponent } from './components/crud-medicos/formulario-medicos/formulario-medicos.component';
import { BuscarMedicoReferenteYCambiarComponent } from './components/dictador/buscar-medico-referente-ycambiar/buscar-medico-referente-ycambiar.component';
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
import { BuscadorMedicosReferentesComponent } from './components/buscador-medicos-referentes/buscador-medicos-referentes.component';


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
    DictadorComponent,
    WorklistComponent,
    SubirInterpretacionComponent,
    LoginComponent,
    AuthorizedComponent,
    LogoutComponent,
    CrudMedicosComponent,
    FormularioMedicosComponent,
    BuscarMedicoReferenteYCambiarComponent,
    NuevoMedicoSoloNombreComponent,
    BuscadorPacientesComponent,
    QrFirmarPoliticasMembresiaComponent,
    MembresiasComponent,
    CrudPacientesComponent,
    LandingMembresiaComponent,
    FirmarMembresiaComponent,
    BuscadorMedicosReferentesComponent
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
    QuillModule.forRoot(),
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: HTTP_INTERCEPTORS, useClass: ResourceInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
