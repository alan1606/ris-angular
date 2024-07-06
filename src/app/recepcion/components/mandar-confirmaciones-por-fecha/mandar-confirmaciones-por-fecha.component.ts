import { Component } from '@angular/core';
import { CitaService } from '../agendar';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-mandar-confirmaciones-por-fecha',
  templateUrl: './mandar-confirmaciones-por-fecha.component.html',
  styleUrls: ['./mandar-confirmaciones-por-fecha.component.css'],
})
export class MandarConfirmacionesPorFechaComponent {
  constructor(
    private citaService: CitaService,
    private alertaService: AlertaService,
    private dialogRef: MatDialogRef<MandarConfirmacionesPorFechaComponent>
  ) {}

  fecha: string = '';
  recibirFecha(fecha: string): void {
    console.log(fecha);
    this.fecha = fecha;
  }
  mandarConfirmaciones(): void {
    console.log(this.fecha);
    this.citaService.mandarConfirmacionesPorFecha(this.fecha).subscribe(
      (data) => {
        this.alertaService.exito('Confirmaciones enviadas');
        this.dialogRef.close();
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }
}
