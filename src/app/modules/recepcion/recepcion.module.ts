import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AgendarCitaComponent } from './components/agendar-cita/agendar-cita.component';
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
