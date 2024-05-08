import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormaPago } from 'src/app/models/formaPago';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Pago } from 'src/app/models/pago';
import Swal from 'sweetalert2';
import { FormaPagoService } from '../../services/forma-pago.service';
import { PagoOrdenService } from '../../services/pago-orden.service';

@Component({
  selector: 'app-pagar-orden',
  templateUrl: './pagar-orden.component.html',
  styleUrls: ['./pagar-orden.component.css'],
})
export class PagarOrdenComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any = null,
    private formaPagoService: FormaPagoService,
    private dialogRef: MatDialogRef<PagarOrdenComponent>,
    private pagoOrdenService: PagoOrdenService
  ) {
    this.dataSource = new MatTableDataSource(this.pagos);
  }

  displayedColumns: string[] = ['Forma', 'Cantidad', 'Factura', 'Quitar'];
  dataSource: MatTableDataSource<Pago>;

  pagos: Pago[] = [];
  pago: Pago = new Pago();
  formaPago: FormaPago = new FormaPago();
  total: number = 0;
  restante: number = 0;

  formasPago: FormaPago[] = [];
  ngOnInit(): void {
    this.total = this.data.total;
    this.restante = this.total;
    this.pago.formaPago = this.formaPago;
    this.pago.factura = false;

    this.formaPagoService.buscarFormasPago().subscribe(
      (data) => {
        this.formasPago = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  agregarPago(): void {
    if (!this.formaPago.id) {
      return;
    }
    if (!this.pago.total) {
      return;
    }

    if (this.restante === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No se puede agregar mas',
      }).then(() => {
        return;
      });
      return;
    }
    if (this.pago.total > this.restante) {
      this.pago.total = this.restante;
    }

    console.log(this.formaPago);
    console.log(this.pago.formaPago);
    this.restante = this.restante - this.pago.total;
    this.pago.formaPago.forma = this.formaPago.forma;
    this.pago.formaPagoId = this.formaPago.id;

    this.pagos.push(this.pago);
    this.dataSource.data = this.pagos;
    this.pago = new Pago();
    this.formaPago = new FormaPago();
    this.pago.formaPago = this.formaPago;
  }

  quitarPago(id: number) {
    let regresarCantidad = this.pagos.find((pago) => pago.id === id);
    console.log(regresarCantidad);
    this.restante += regresarCantidad.total;
    console.log(this.pagos);
    this.pagos = this.pagos.filter((pago) => pago !== regresarCantidad);
    this.dataSource.data = this.pagos;
  }

  finalizarPago(): void {
    if (this.restante === 0) {
      console.log('pagando');
      this.pagoOrdenService
        .crearPagosPorOrdenId(this.data.orden.id, this.pagos)
        .subscribe(
          (data) => {
            console.log('pagado');
            console.log(this.pagos);
            Swal.fire({
              icon: 'success',
              title: 'Pago completado',
            }).then(() => {
              const restante = 0;
              this.dialogRef.close(restante);
            });
          },
          (error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
            });
          }
        );
    } else {
      console.log(this.restante);
      Swal.fire({
        icon: 'error',
        title: 'Termine de pagar',
      });
    }
  }
}
