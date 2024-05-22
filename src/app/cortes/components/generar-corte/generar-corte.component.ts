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
  public fecha: Date = new Date();
  private fechaString;
  public turnos: TurnoCorte[] = [];
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
    console.log(this.turno);
    this.fechaString = this.fecha.toISOString().slice(0, 10);
    this.corteService
      .obtenerCorte(this.fechaString, this.turno.nombre)
      .subscribe(
        (data: Blob) => {
          console.log("exitos");
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        (error) => {
          Swal.fire("Error", error.error.detail, "error");
          console.log(error);
        }
      );
  }
}
