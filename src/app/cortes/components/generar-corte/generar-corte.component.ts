import { Component, OnInit } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { TurnoCorte } from 'src/app/models/turnoCorte';
import { CorteService } from '../../services/corte.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generar-corte',
  templateUrl: './generar-corte.component.html',
  styleUrls: ['./generar-corte.component.css'],
})
export class GenerarCorteComponent implements OnInit {
  public fecha: Date = null;
  private fechaString = null;
  public turnos: TurnoCorte[] = [];
  protected generandoCorte: boolean = false;
  turno: TurnoCorte = null;
  constructor(
    private turnoService: TurnoService,
    private corteService: CorteService
  ) {}

  ngOnInit(): void {
    this.turnoService.verTurnos().subscribe(
      (data) => {
        this.turnos = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  actualizarFecha(fechaSeleccionada: HTMLInputElement) {
    console.log(fechaSeleccionada.value);
  }

  generarCorte() {
    if (!this.turno || !this.fecha) {
      Swal.fire({
        icon: 'info',
        title: 'Complete los campos',
      });
      return;
    }
    this.generandoCorte = true;

    this.fechaString = this.fecha.toISOString().slice(0, 10);

    this.corteService
      .obtenerCorte(this.fechaString, this.turno.nombre)
      .subscribe(
        (data: Blob) => {
          console.log('exitos');
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          Swal.fire({
            icon: 'success',
            title: 'Corte generado',
            text: 'Revise sus descargas',
          });
          window.open(url);
          this.generandoCorte = false;
        },
        (error) => {
          Swal.fire('Error', error.error.detail, 'error');
          console.log(error);
          this.generandoCorte = false;
        }
      );
  }
}
