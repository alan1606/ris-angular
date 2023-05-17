import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { URL_SUBIR_FOTO } from 'src/app/config/app';
import { OrdenVenta } from 'src/app/models/orden-venta';

@Component({
  selector: 'app-qr-subir-foto-orden-modal',
  templateUrl: './qr-subir-foto-orden-modal.component.html',
  styleUrls: ['./qr-subir-foto-orden-modal.component.css']
})
export class QrSubirFotoOrdenModalComponent implements OnInit {

  orden: OrdenVenta;

  title = 'app';
  elementType =  NgxQrcodeElementTypes.URL;
  value = URL_SUBIR_FOTO;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.orden = this.data.orden as OrdenVenta;
    this.value += this.orden.id;
  }

}
