import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AgendarCitaComponent } from './components/agendar-cita/agendar-cita.component';
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




@NgModule({
    declarations: [
        AgendarCitaComponent,
        QrSubirFotoOrdenModalComponent,
        RegistrarPacienteComponent
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
        MatNativeDateModule
    ],
    exports: [
        AgendarCitaComponent
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class RecepcionModule { }
