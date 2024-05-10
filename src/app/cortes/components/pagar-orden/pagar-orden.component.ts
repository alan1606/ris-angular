import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormaPago } from 'src/app/models/formaPago';
import { Pago } from 'src/app/models/pago';
import Swal from 'sweetalert2';
import { FormaPagoService } from '../../services/forma-pago.service';
import { Descuento } from 'src/app/models/descuento';

@Component({
  selector: 'app-pagar-orden',
  templateUrl: './pagar-orden.component.html',
  styleUrls: ['./pagar-orden.component.css'],
})
export class PagarOrdenComponent implements OnInit {
  @Input() orden: any;
  @Output() public pagosEmit: EventEmitter<Pago[]> = new EventEmitter();
  @Output() public descuentosEmit: EventEmitter<Descuento[]> =
    new EventEmitter();

  constructor(private formaPagoService: FormaPagoService) {
    this.dataSource = new MatTableDataSource(this.pagos);
    this.descuentosdataSource = new MatTableDataSource(this.descuentos);
  }

  displayedColumns: string[] = ['Forma', 'Cantidad', 'Factura', 'Quitar'];
  dataSource: MatTableDataSource<Pago>;

  descuentosdisplayedColumns: string[] = ['Descripcion', 'Cantidad', 'Quitar'];
  descuentosdataSource: MatTableDataSource<Descuento>;
  descuentos: Descuento[] = [];
  descuento: Descuento = new Descuento();

  pagos: Pago[] = [];
  pago: Pago = new Pago();
  formaPago: FormaPago = new FormaPago();
  total: number = 0;
  restante: number = 0;
  formasPago: FormaPago[] = [];

  ngOnInit(): void {
    this.total = this.orden.totalSinDescuento;
    this.restante = this.total;
    this.pago.formaPago = this.formaPago;
    this.pago.factura = false;

    if (this.total === 0) {
      this.pagosEmit.emit(this.pagos);
    }

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
      });
      return;
    }
    if (this.pago.total > this.restante) {
      this.pago.total = this.restante;
    }

    this.restante = this.restante - this.pago.total;
    this.pago.formaPago.forma = this.formaPago.forma;
    this.pago.formaPagoId = this.formaPago.id;

    this.pagos.push(this.pago);
    this.dataSource.data = this.pagos;
    this.pagosEmit.emit(this.pagos);
    this.pago = new Pago();
    this.formaPago = new FormaPago();
    this.pago.formaPago = this.formaPago;
  }

  quitarPago(id: number) {
    let regresarCantidad = this.pagos.find((pago) => pago.id === id);
    this.restante += regresarCantidad.total;
    this.pagos = this.pagos.filter((pago) => pago !== regresarCantidad);
    this.dataSource.data = this.pagos;
    this.pagosEmit.emit(this.pagos);
  }

  agregarDescuento(): void {
    if (!this.descuento.cantidad) {
      return;
    }
    if (!this.descuento.descripcion) {
      return;
    }

    if (this.restante === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No se puede agregar mas',
      });
      return;
    }
    if (this.descuento.cantidad > this.restante) {
      this.descuento.cantidad = this.restante;
    }
    this.restante = this.restante - this.descuento.cantidad;
    this.descuentos.push(this.descuento);
    this.descuentosdataSource.data = this.descuentos;
    this.descuentosEmit.emit(this.descuentos);
    this.descuento = new Descuento();
  }

  quitarDescuento(id: number) {
    let regresarCantidad = this.descuentos.find(
      (descuento) => descuento.id === id
    );
    this.descuentos = this.descuentos.filter(
      (descuento) => descuento !== regresarCantidad
    );
    this.descuentosdataSource.data = this.descuentos;
    this.descuentosEmit.emit(this.descuentos);
  }

  // finalizarPago(): void {
  //   if (this.restante === 0) {
  //     console.log('pagando');
  //     this.pagoOrdenService
  //       .crearPagosPorOrdenId(this.data.orden.id, this.pagos)
  //       .subscribe(
  //         (data) => {
  //           console.log('pagado');
  //           console.log(this.pagos);
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Pago completado',
  //           }).then(() => {
  //             const restante = 0;
  //           });
  //         },
  //         (error) => {
  //           console.log(error);
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //           });
  //         }
  //       );
  //   } else {
  //     console.log(this.restante);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Termine de pagar',
  //     });
  //   }
  // }
}
