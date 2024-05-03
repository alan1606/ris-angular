import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TurnoCorte } from 'src/app/models/turnoCorte';
import Swal from 'sweetalert2';
import { TurnoService } from '../../services/turno.service';

@Component({
  selector: 'app-agregar-turnos-modal',
  templateUrl: './agregar-turnos-modal.component.html',
  styleUrls: ['./agregar-turnos-modal.component.css'],
})
export class AgregarTurnosModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public idTurno: number = null,
    private turnoService: TurnoService
  ) {}
  model: TurnoCorte = new TurnoCorte();
  ngOnInit() {
    this.idTurno ? console.log(this.idTurno) : null;
    if (this.idTurno) {
      this.turnoService.buscarTurnoPorId(this.idTurno).subscribe(
        (data) => (this.model = data),
        (err) => console.log(err)
      );
    }
  }
  guardarTurno(): void {
    if (!this.model.nombre || !this.model.horaInicio || !this.model.horaFin) {
      Swal.fire({
        icon: 'error',
        title: 'Complete los campos',
      });
      return;
    }

    this.model.horaInicio = this.model.horaInicio + ':00';
    this.model.horaFin = this.model.horaFin + ':00';

    this.turnoService.guardarTurno(this.model).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Turno guardado Correctamente',
        });
      },
      (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'No se guardo el turno',
        });
      }
    );
  }
  editarTurno(): void {
    console.log('editar turno');
    if (!this.model.nombre || !this.model.horaInicio || !this.model.horaFin) {
      Swal.fire({
        icon: 'error',
        title: 'Complete los campos',
      });
      return;
    }

    this.turnoService.editarTurno(this.idTurno, this.model).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Turno editado Correctamente',
        });
      },
      (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'No se edito el turno',
        });
      }
    );
  }
}
