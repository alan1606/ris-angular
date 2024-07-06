import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { QrSubirFotoOrdenModalComponent } from './components/qr-subir-foto-orden-modal/qr-subir-foto-orden-modal.component';
import { RegistrarPacienteComponent } from './components/registrar-paciente-modal/registrar-paciente.component';
import { AppComponent } from 'src/app/app.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { UrgenciaComponent } from './components/urgencia/urgencia.component';
import { RecepcionRoutingModule } from './recepcion-routing.module';
import { EnviarEstudiosComponent } from './components/enviar-estudios/enviar-estudios.component';
import { EnviarEstudioComponent } from './components/enviar-estudio/enviar-estudio.component';
import { SubirFotoOrdenComponent } from './components/subir-foto-orden/subir-foto-orden.component';
import { VerAgendadosModalComponent } from './components/agenda/ver-agendados-modal/ver-agendados-modal.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { QRCodeModule } from 'angular2-qrcode';
import { AgendarComponent } from './components/agendar/agendar.component';
import { RegistrarPacienteParcialModalComponent } from './components/registrar-paciente-parcial-modal/registrar-paciente-parcial-modal.component';
import { RegistroCompletoPacienteComponent } from './components/registro-completo-paciente/registro-completo-paciente.component';
import { ConfirmarCitaPacienteComponent } from './components/confirmar-cita-paciente/confirmar-cita-paciente.component';
import { ConfirmacionesCitasComponent } from './components/confirmaciones-citas/confirmaciones-citas.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { CheckInComponent } from './components/check-in/check-in.component';
import { PacienteOrdenesComponent } from './components/check-in/paciente-ordenes/paciente-ordenes.component';
import { VerOrdenModalComponent } from './components/check-in/ver-orden-modal/ver-orden-modal.component';
import { ReagendarCitaModalComponent } from './components/reagendar-cita-modal/reagendar-cita-modal.component';
import { GenerarQrCheckinComponent } from './components/generar-qr-checkin/generar-qr-checkin.component';
import { FormularioPacienteComponent } from './components/formulario-paciente/formulario-paciente.component';
import { BuscarPacienteSubirFotoOrdenComponent } from './components/buscar-paciente-subir-foto-orden/buscar-paciente-subir-foto-orden.component';
import { MostrarCitasPorDiaPensionesComponent } from './components/mostrar-citas-por-dia-pensiones/mostrar-citas-por-dia-pensiones.component';
import { CambiarEstudioComponent } from './components/check-in/cambiar-estudio/cambiar-estudio.component';
import { AgregarEstudioComponent } from './components/check-in/agregar-estudio/agregar-estudio.component';
import { LimboComponent } from './components/limbo/limbo.component';
import { SharedModule } from '../shared/shared.module';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {MatStepperModule} from '@angular/material/stepper'
import { CortesModule } from '../cortes/cortes.module';
import { MandarConfirmacionesPorFechaComponent } from './components/mandar-confirmaciones-por-fecha/mandar-confirmaciones-por-fecha.component';

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
        CheckInComponent,
        PacienteOrdenesComponent,
        VerOrdenModalComponent,
        ReagendarCitaModalComponent,
        GenerarQrCheckinComponent,
        FormularioPacienteComponent,
        BuscarPacienteSubirFotoOrdenComponent,
        MostrarCitasPorDiaPensionesComponent,
        CambiarEstudioComponent,
        AgregarEstudioComponent,
        LimboComponent,
        MandarConfirmacionesPorFechaComponent
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
        MatPaginatorModule,
        SharedModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatStepperModule,
        CortesModule
    ],
    exports: [
        UrgenciaComponent
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class RecepcionModule { }
