import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { DevolucionesService } from 'src/app/services/devoluciones.service';
import { DevolucionModalComponent } from '../devolucion-modal/devolucion-modal.component';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.css'],
})
export class DevolucionesComponent implements OnInit {
  devolucionesdisplayedColumns: string[] = [
    'Paciente',
    'Estudios',
    'Total',
    'Devolver',
  ];
  devolucionesdataSource: MatTableDataSource<OrdenVenta>;
  devoluciones: OrdenVenta[] = [];
  devolucionesFiltrada: OrdenVenta[] = [];
  fecha: Date;
  fechaString: string = '';
  paciente: string = '';
  constructor(
    private devolucionesService: DevolucionesService,
    private dialog: MatDialog
  ) {
    this.devolucionesdataSource = new MatTableDataSource(this.devoluciones);
  }

  ngOnInit(): void {
    this.fecha = new Date();
    this.fechaString = this.fecha.toISOString().slice(0, 10);
    this.devolucionesService
      .buscarOrdenesParaDevolucion(this.fechaString)
      .subscribe((data) => {
        this.devoluciones = data;
        this.devolucionesFiltrada = data;
        this.devolucionesdataSource.data = data;
      });
  }

  buscarPorPaciente() {
    this.devolucionesdataSource.data = this.devoluciones.filter((orden) =>
      orden.paciente.nombreCompleto.includes(this.paciente.toUpperCase())
    );
  }

  buscar(paciente: string, fecha: Date): void {
    if (!paciente && fecha) {
      this.fechaString = fecha.toISOString().slice(0, 10);
      this.devolucionesService
        .buscarOrdenesParaDevolucion(this.fechaString)
        .subscribe((data) => {
          this.devoluciones = data;
          this.devolucionesdataSource.data = data;
        });
    }
  }

  devolver(orden: OrdenVenta): void {
    this.dialog.open(DevolucionModalComponent, {
      width: '512px',
      data: orden,
    });
  }
}
