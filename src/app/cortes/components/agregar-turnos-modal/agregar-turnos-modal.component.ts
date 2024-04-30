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
    @Inject(MAT_DIALOG_DATA) public idOrden: number = null,
    private turnoService: TurnoService
  ) {}
  model: TurnoCorte = new TurnoCorte();
  ngOnInit() {
    this.idOrden ? console.log(this.idOrden) : null;
  }
  guardarTurno(): void {
    console.log('guardar turno');
    if (!this.model.nombre || !this.model.horaInicio || !this.model.horaFin) {
      Swal.fire({
        icon: 'error',
        title: 'Complete los campos',
      });
      return;
    }

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

    this.turnoService.editarTurno(this.idOrden, this.model).subscribe(
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
