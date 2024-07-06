import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AgregarMovimientoCorteModalComponent } from '../agregar-movimiento-corte-modal/agregar-movimiento-corte-modal.component';
import { CorteService } from '../../services/corte.service';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Movimiento } from 'src/app/models/movimiento';

@Component({
  selector: 'app-movimientos-cortes',
  templateUrl: './movimientos-cortes.component.html',
  styleUrls: ['./movimientos-cortes.component.css'],
})
export class MovimientosCortesComponent implements OnInit {
  constructor(private dialog: MatDialog, private corteService: CorteService) {
    this.dataSource = new MatTableDataSource(this.movimientos);
  }

  displayedColumns: string[] = ['Movimiento', 'Tipo', 'Cantidad'];

  dataSource: MatTableDataSource<Movimiento>;
  movimientos: Movimiento[] = [];
  turno: string = null;
  fecha: string = null;
  ngOnInit(): void {
    this.corteService.obtenerCorteActual().subscribe(
      ({ turno, fecha, movimientos }) => {
        this.turno = turno;
        this.fecha = fecha;
        this.movimientos = movimientos;
        this.dataSource.data = this.movimientos;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  agregarMovimiento(): void {
    const matDialog = this.dialog.open(AgregarMovimientoCorteModalComponent, {
      width: '1000px',
    });
    matDialog.afterClosed().subscribe(
      (data) => {
        if (data) {
          this.movimientos.push(data);
          this.dataSource.data = this.movimientos;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
