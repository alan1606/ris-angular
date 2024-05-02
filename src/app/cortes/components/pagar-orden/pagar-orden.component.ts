import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormaPago } from 'src/app/models/formaPago';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Pago } from 'src/app/models/pago';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagar-orden',
  templateUrl: './pagar-orden.component.html',
  styleUrls: ['./pagar-orden.component.css'],
})
export class PagarOrdenComponent implements OnInit {
  // constructor(@Inject(MAT_DIALOG_DATA) public orden: OrdenVenta=null) {}
  constructor() {
    this.dataSource = new MatTableDataSource(this.pagos);
  }

  displayedColumns: string[] = ['Forma', 'Cantidad', 'Factura', 'Quitar'];
  dataSource: MatTableDataSource<Pago>;

  pagos: Pago[] = [];
  pago: Pago = new Pago();
  formaPago: FormaPago = new FormaPago();
  total: number = 1000;
  restante = this.total;

  ngOnInit(): void {}

  agregarPago(): void {
    this.pago.id = this.pagos.length + 1;
    if (this.restante === 0) {
      Swal.fire({
        icon:"info",
        title:"No se puede agregar mas"
      }).then(()=>{
        return
      })
      return;
    }
    if (this.pago.cantidad > this.restante) {
      this.pago.cantidad = this.restante;
    }
    this.restante = this.restante - this.pago.cantidad;
    this.pago.formaPago = this.formaPago;

    this.pagos.push(this.pago);
    this.dataSource.data = this.pagos;
    this.pago = new Pago();
    this.formaPago = new FormaPago();
  }

  quitarPago(id: number) {
    let regresarCantidad = this.pagos.find((pago) => pago.id === id);
    this.restante += regresarCantidad.cantidad;
    this.pagos = this.pagos.filter((pago) => pago.id !== id);
    this.dataSource.data = this.pagos;
  }

  finalizarPago(): void {
    if (this.restante === 0) {
      Swal.fire({
        icon: 'success',
        title: 'Pago completado',
      });
      return;
    }
    Swal.fire({
      icon: 'error',
      title: 'Termine de pagar',
    });
    return;
  }
}
