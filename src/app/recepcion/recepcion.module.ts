import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { MatDialogModule } from '@angular/material/dialog';
import { QrSubirFotoOrdenModalComponent } from './components/qr-subir-foto-orden-modal/qr-subir-foto-orden-modal.component';
import { RegistrarPacienteComponent } from './components/registrar-paciente-modal/registrar-paciente.component';
import { AppComponent } from 'src/app/app.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { UrgenciaComponent } from './components/urgencia/urgencia.component';
import { RecepcionRoutingModule } from './recepcion-routing.module';
import { EnviarEstudiosComponent } from './components/enviar-estudios/enviar-estudios.component';
import { EnviarEstudioComponent } from './components/enviar-estudio/enviar-estudio.component';
import { SubirFotoOrdenComponent } from './components/subir-foto-orden/subir-foto-orden.component';
import { VerAgendadosModalComponent } from './components/agenda/ver-agendados-modal/ver-agendados-modal.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { MatTableModule } from '@angular/material/table';
import { QRCodeModule } from 'angular2-qrcode';
import { AgendarComponent } from './components/agendar/agendar.component';
import { RegistrarPacienteParcialModalComponent } from './components/registrar-paciente-parcial-modal/registrar-paciente-parcial-modal.component';
import { RegistroCompletoPacienteComponent } from './components/registro-completo-paciente/registro-completo-paciente.component';
import { ConfirmarCitaPacienteComponent } from './components/confirmar-cita-paciente/confirmar-cita-paciente.component';
import { ConfirmacionesCitasComponent } from './components/confirmaciones-citas/confirmaciones-citas.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReagendarCitaModalComponent } from './components/reagendar-cita-modal/reagendar-cita-modal.component';
import { GenerarQrCheckinComponent } from './components/generar-qr-checkin/generar-qr-checkin.component';


@NgModule({
    declarations: [
        UrgenciaComponent,
        QrSubirFotoOrdenModalComponent,
        RegistrarPacienteComponent,
        EnviarEstudiosComponent,
        EnviarEstudioComponent,
        SubirFotoOrdenComponent,
        QrSubirFotoOrdenModalComponent,
        VerAgendadosModalComponent,
        AgendaComponent,
        AgendarComponent,
        RegistrarPacienteParcialModalComponent,
        RegistroCompletoPacienteComponent,
        ConfirmarCitaPacienteComponent,
        ConfirmacionesCitasComponent,
        ReagendarCitaModalComponent,
        GenerarQrCheckinComponent
        ],
    imports: [
        CommonModule,
        FormsModule,
        MatAutocompleteModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        NgxQRCodeModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        RecepcionRoutingModule,
        MatTableModule,
        QRCodeModule,
        MatPaginatorModule
    ],
    exports: [
        UrgenciaComponent
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class RecepcionModule { }
