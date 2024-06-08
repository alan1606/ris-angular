import { Component } from '@angular/core';
import { CitaService } from '../agendar';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-mandar-confirmaciones-por-fecha',
  templateUrl: './mandar-confirmaciones-por-fecha.component.html',
  styleUrls: ['./mandar-confirmaciones-por-fecha.component.css'],
})
export class MandarConfirmacionesPorFechaComponent {
  constructor(
    private citaService: CitaService,
    private alertaService: AlertaService
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
        console.log(data);
      },
      (error) => {
        this.alertaService.error(error);
        console.log(error);
      }
    );
  }
}
