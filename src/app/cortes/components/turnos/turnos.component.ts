import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AgregarTurnosModalComponent } from '../agregar-turnos-modal/agregar-turnos-modal.component';
import { TurnoCorte } from 'src/app/models/turnoCorte';
import { TurnoService } from '../../services/turno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css'],
})
export class TurnosComponent implements OnInit {
  constructor(private dialog: MatDialog, private turnoService: TurnoService) {}
  displayedColumns: string[] = [
    'Nombre',
    'Hora Inicio',
    'Hora Fin',
    'Modificar',
  ];
  dataSource: TurnoCorte[] = [];

  ngOnInit(): void {
    this.verTurnos();
  }
  crearTurno(): void {
    const modalRef = this.dialog.open(AgregarTurnosModalComponent, {
      width: '500px',
    });
    modalRef.afterClosed().subscribe(() => {
      this.verTurnos();
      return;
    });
  }

  editarTurno(id: number): void {
    const modalRef = this.dialog.open(AgregarTurnosModalComponent, {
      width: '500px',
      data: id,
    });
    modalRef.afterClosed().subscribe(() => {
      this.verTurnos();
      return;
    });
  }

  verTurnos(): void {
    this.turnoService.verTurnos().subscribe(
      (data) => {
        this.dataSource = data;
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'info',
          title: 'No hay turnos',
        });
      }
    );
  }
}
