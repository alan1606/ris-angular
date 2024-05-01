import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgregarTurnosModalComponent } from '../agregar-turnos-modal/agregar-turnos-modal.component';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css'],
})
export class TurnosComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  displayedColumns: string[] = [
    'Nombre',
    'Hora Inicio',
    'Hora Fin',
    'Modificar',
  ];
  dataSource = [
    { id: 1, Nombre: 'juan', HoraInicio: '07:00', HoraFin: '13:00' },
  ];

  editarTurno(id: number): void {
    console.log(id);
    const modalRef = this.dialog.open(AgregarTurnosModalComponent, {
      width: '500px',
      data: { idTurno: id },
    });
  }

  crearTurno(): void {
    const modalRef = this.dialog.open(AgregarTurnosModalComponent, {
      width: '500px',
    });
  }
}
