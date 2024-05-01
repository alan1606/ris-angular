import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdenVenta } from 'src/app/models/orden-venta';

@Component({
  selector: 'app-pagar-orden',
  templateUrl: './pagar-orden.component.html',
  styleUrls: ['./pagar-orden.component.css'],
})
export class PagarOrdenComponent implements OnInit {
  // constructor(@Inject(MAT_DIALOG_DATA) public orden: OrdenVenta=null) {}

  displayedColumns: string[] = [
    'Forma',
    'Cantidad',
    'Factura',
    'Quitar',
  ];
  dataSource = [
    { id: 1, Nombre: 'juan', HoraInicio: '07:00', HoraFin: '13:00' },
  ];

  ngOnInit(): void {
    console.log();
  }
}
