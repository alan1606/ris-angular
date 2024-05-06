import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgregarMovimientoCorteModalComponent } from '../agregar-movimiento-corte-modal/agregar-movimiento-corte-modal.component';

@Component({
  selector: 'app-movimientos-cortes',
  templateUrl: './movimientos-cortes.component.html',
  styleUrls: ['./movimientos-cortes.component.css'],
})
export class MovimientosCortesComponent {
  constructor(private dialog: MatDialog) {}

  displayedColumns: string[] = ['Movimiento', 'Tipo', 'Cantidad'];

  dataSource = [{ movimiento: 'Luz', tipo: 'Salida', cantidad: 2000 }];

  agregarMovimiento(): void {
    this.dialog.open(AgregarMovimientoCorteModalComponent, {
      width: '500px',
    });
  }
}
