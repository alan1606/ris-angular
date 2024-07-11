import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { URL_SUBIR_FOTO } from 'src/app/config/app';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { OrdenVentaService } from '../agendar';

@Component({
  selector: 'app-qr-subir-foto-orden-modal',
  templateUrl: './qr-subir-foto-orden-modal.component.html',
  styleUrls: ['./qr-subir-foto-orden-modal.component.css'],
})
export class QrSubirFotoOrdenModalComponent implements OnInit {
  orden: OrdenVenta;

  title = 'app';
  elementType = NgxQrcodeElementTypes.URL;
  value = URL_SUBIR_FOTO;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: OrdenVentaService
  ) {}

  ngOnInit(): void {
    this.orden = this.data.orden as OrdenVenta;

    this.service.ver(this.orden.id).subscribe(
      (data) => {
        this.orden = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.value += this.orden.id;
  }
}
