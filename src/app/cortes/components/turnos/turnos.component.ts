import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    this.turnoService.verTurnos().subscribe(
      (data) => {
        console.log(data)
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
  crearTurno(): void {
    const modalRef = this.dialog.open(AgregarTurnosModalComponent, {
      width: '500px',
    });
  }

  editarTurno(id: number): void {
    console.log(id);
    const modalRef = this.dialog.open(AgregarTurnosModalComponent, {
      width: '500px',
      data: { idTurno: id },
    });
  }
}
