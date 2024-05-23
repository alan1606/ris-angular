import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    private turnoService: TurnoService,
    public dialogRef: MatDialogRef<AgregarTurnosModalComponent>
  ) {}

  model: TurnoCorte = new TurnoCorte();

  ngOnInit() {
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

    this.turnoService.guardarTurno(this.model).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Turno guardado Correctamente',
        }).then(() => {
          this.dialogRef.close();
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
    if (!this.model.nombre || !this.model.horaInicio || !this.model.horaFin) {
      Swal.fire({
        icon: 'error',
        title: 'Complete los campos',
      });
      return;
    }

    this.turnoService.editarTurno(this.idTurno, this.model).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Turno editado Correctamente',
        }).then(() => {
          this.dialogRef.close();
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
