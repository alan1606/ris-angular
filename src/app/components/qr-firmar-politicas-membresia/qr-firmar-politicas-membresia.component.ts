import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { Paciente } from 'src/app/models/paciente';
import { BASE_SITE } from 'src/app/config/app';

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
      this.paciente.nombreCompleto = this.paciente.nombre + " " + this.paciente.apellidoPaterno + " " + this.paciente.apellidoMaterno;

      if (!this.paciente.nombreCompleto || !this.codigo) {
        return;
      }
      // let url = `https://diagnocons.com/v1/firma?nombreBeneficiario=${this.paciente.nombreCompleto}&codigoMembresia=${this.codigo}`;
      let url = `${BASE_SITE}/membresias/firmar/${this.paciente.id}/${this.paciente.nombreCompleto}/${this.codigo}`
      this.value = url;
    }
    return;
  }

  firmar(): void {
    window.open(this.value, "_blank");
  }
}
