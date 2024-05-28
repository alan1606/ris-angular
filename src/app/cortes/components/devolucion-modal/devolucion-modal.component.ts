import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Paciente } from 'src/app/models/paciente';
import { MovimientosCortesService } from '../../services/movimientos-cortes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-devolucion-modal',
  templateUrl: './devolucion-modal.component.html',
  styleUrls: ['./devolucion-modal.component.css'],
})
export class DevolucionModalComponent implements OnInit {
  paciente: Paciente;
  total: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OrdenVenta,
    private dialogRef: MatDialogRef<DevolucionModalComponent>,
    private movimientosCortesService: MovimientosCortesService
  ) {}
  ngOnInit(): void {
    console.log(this.data);
    this.paciente = this.data.paciente;
    this.total = this.data.totalSinDescuento;
  }
  cerrar() {
    this.dialogRef.close();
  }
  hacerDevolucion() {
    Swal.fire({
      icon: 'info',
      title: 'Procesando',
      text: 'Procesando la devolución',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });
    this.movimientosCortesService.crearDevolucion(this.data).subscribe(
      (data) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Devolución',
          text: 'Devolución exitosa',
        });
        console.log(data);
        this.dialogRef.close();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
        });
        console.log(error);
      }
    );
    console.log('devolvido');
  }
}
