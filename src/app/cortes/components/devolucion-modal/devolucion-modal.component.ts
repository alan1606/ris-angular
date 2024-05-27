import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Paciente } from 'src/app/models/paciente';

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
    private dialogRef: MatDialogRef<DevolucionModalComponent>
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
    console.log('devolvido');
  }
}
