import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { Paciente } from 'src/app/models/paciente';

@Component({
  selector: 'app-qr-firmar-politicas-membresia',
  templateUrl: './qr-firmar-politicas-membresia.component.html',
  styleUrls: ['./qr-firmar-politicas-membresia.component.css'],
})
export class QrFirmarPoliticasMembresiaComponent implements OnInit {
  elementType = NgxQrcodeElementTypes.URL;
  paciente: Paciente = null;
  codigo: string = null;
  value: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {
    if (this.data.paciente && this.data.membresia) {
      this.paciente = this.data.paciente;
      this.codigo = this.data.membresia;
      if (!this.paciente.nombreCompleto || !this.codigo) {
        return;
      }
      let url = `https://diagnocons.com/v1/firma?nombreBeneficiario=${this.paciente.nombreCompleto}&codigoMembresia=${this.codigo}`;
      this.value = url;
      // this.url += this.paciente.nombreCompleto.replace(/\s/g, "")+ '/' + this.codigo;
    }
    return;
  }

  firmar(): void {
    window.location.href = this.value;
  }
}
