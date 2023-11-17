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
import { UrgenciaComponent } from './components/agendar-cita/urgencia.component';
import { RecepcionRoutingModule } from './recepcion-routing.module';
import { EnviarEstudiosComponent } from './components/enviar-estudios/enviar-estudios.component';
import { EnviarEstudioComponent } from './components/enviar-estudio/enviar-estudio.component';
import { SubirFotoOrdenComponent } from './components/subir-foto-orden/subir-foto-orden.component';
import { VerAgendadosModalComponent } from './components/agenda/ver-agendados-modal/ver-agendados-modal.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { MatTableModule } from '@angular/material/table';
import { QRCodeModule } from 'angular2-qrcode';




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
        AgendaComponent
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
        QRCodeModule
    ],
    exports: [
        UrgenciaComponent
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class RecepcionModule { }
