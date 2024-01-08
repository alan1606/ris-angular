import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { ConceptosComponent } from './components/conceptos/conceptos.component';
import { LayoutModule } from './layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PacientesFormComponent } from './components/pacientes/pacientes-form.component';
import { VentaConceptosComponent } from './components/venta-conceptos/venta-conceptos.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule} from '@angular/material/button';
import { BuscarEstudioModalComponent } from './components/studies/buscar-estudio-modal/buscar-estudio-modal.component';
import { MatDialogModule} from '@angular/material/dialog';
import { EnviarEstudioModalComponent } from './components/studies/enviar-estudio-modal/enviar-estudio-modal.component';
import { InformacionEstudioModalComponent } from './components/studies/informacion-estudio-modal/informacion-estudio-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AntecedentesEstudioModalComponent } from './components/venta-conceptos/antecedentes-estudio-modal/antecedentes-estudio-modal.component';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MedicoRadiologoComponent } from './components/medico-radiologo/medico-radiologo.component';
import { DictadorComponent } from './components/dictador/dictador.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { DictamenComponent } from './components/resultados/dictamen.component';
import { WorklistComponent } from './components/worklist/worklist.component';
import { SubirInterpretacionComponent } from './components/dictador/subir-interpretacion/subir-interpretacion.component';
import { OrdenVentaComponent } from './components/resultados/orden-venta.component';
import { LoginComponent } from './components/usuarios/login/login.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { QuillModule } from 'ngx-quill';
import { AuthorizedComponent } from './components/authorized/authorized.component';
import { ResourceInterceptor } from './interceptors/resource.interceptor';
import { LogoutComponent } from './components/logout/logout.component';
import { RecepcionModule } from './recepcion/recepcion.module';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { CrudMedicosComponent } from './components/crud-medicos/crud-medicos.component';
import { FormularioMedicosComponent } from './components/crud-medicos/formulario-medicos/formulario-medicos.component';


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
        ResultadosComponent,
        DictamenComponent,
        WorklistComponent,
        SubirInterpretacionComponent,
        OrdenVentaComponent,
        LoginComponent,
        AuthorizedComponent,
        LogoutComponent,
        CrudMedicosComponent,
        FormularioMedicosComponent,
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
        RecepcionModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        QuillModule.forRoot()
    ],
    providers: [
        DatePipe,
        {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
        {provide: HTTP_INTERCEPTORS, useClass: ResourceInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
