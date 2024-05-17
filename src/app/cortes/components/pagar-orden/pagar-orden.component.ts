import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormaPago } from 'src/app/models/formaPago';
import { Pago } from 'src/app/models/pago';
import Swal from 'sweetalert2';
import { FormaPagoService } from '../../services/forma-pago.service';
import { Descuento } from 'src/app/models/descuento';
import { DataService } from 'src/app/recepcion/components/services/data-service.service';

@Component({
  selector: 'app-pagar-orden',
  templateUrl: './pagar-orden.component.html',
  styleUrls: ['./pagar-orden.component.css'],
})
export class PagarOrdenComponent implements OnInit, OnDestroy {
  @Input() public orden: any;
  @Output() public pagosEmit: EventEmitter<Pago[]> = new EventEmitter();
  @Output() public descuentosEmit: EventEmitter<Descuento[]> =
    new EventEmitter();
  @Output() public pagoOdescuentoEliminadoEmit: EventEmitter<boolean> =
    new EventEmitter();

  constructor(
    private formaPagoService: FormaPagoService,
    private dataService: DataService
  ) {
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
    this.pago.formaPago = this.formaPago;
    this.pago.factura = false;

    this.dataService.precioData$.subscribe((data) => {
      this.total = data;
      this.restante = this.total;
    });
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
    if (this.restante === 0) {
      this.pagosEmit.emit(this.pagos);
    }
    this.pago = new Pago();
    this.formaPago = new FormaPago();
    this.pago.formaPago = this.formaPago;
  }

  quitarPago(id: number) {
    let regresarCantidad = this.pagos.find((pago) => pago.id === id);
    this.restante += regresarCantidad.total;
    this.pagos = this.pagos.filter((pago) => pago !== regresarCantidad);
    this.dataSource.data = this.pagos;
    this.pagoOdescuentoEliminadoEmit.emit(true);
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
    if (this.restante === 0) {
      this.pagosEmit.emit(this.pagos);
    }
    this.descuento = new Descuento();
  }

  quitarDescuento(id: number) {
    let regresarCantidad = this.descuentos.find(
      (descuento) => descuento.id === id
    );
    this.restante += regresarCantidad.cantidad;
    this.descuentos = this.descuentos.filter(
      (descuento) => descuento !== regresarCantidad
    );
    this.descuentosdataSource.data = this.descuentos;
    this.pagoOdescuentoEliminadoEmit.emit(true);
  }

  ngOnDestroy(): void {
    console.log("Destruyendo pagar orden")
    this.pagos = [];
    this.descuentos = [];
  }

}
