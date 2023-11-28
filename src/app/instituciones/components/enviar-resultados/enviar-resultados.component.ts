import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RegistrarMedicoModalComponent } from './registrar-medico-modal/registrar-medico-modal.component';
import { OrdenVenta } from 'src/app/models/orden-venta';

@Component({
  selector: 'app-enviar-resultados',
  templateUrl: './enviar-resultados.component.html',
  styleUrls: ['./enviar-resultados.component.css'],
})
export class EnviarResultadosComponent implements OnInit {
  constructor(private dialog: MatDialog) {}
  data;
  id: number = null;
  Orden: OrdenVenta;
  Medico: string = '';
  Nombres: string = '';
  Apellidos: string = '';
  Especialidad: string = '';
  Cedula: string = '';
  Correo: string = '';
  Whatsapp: any;
  Direccion: string = '';
  FechaNacimiento: string = '';
  Sexo: string[] = ['Masculino', 'Femenino'];

  ngOnInit(): void {
    this.obtenerDatos();
    this.datosMedico();
    if (this.id == null) {
      this.abrirModalRegistrarMedico();
    }
  }

  obtenerDatos(): void {
    const local = localStorage.getItem('datos');
    const datos = JSON.parse(local);
    this.data = datos;
    this.Orden = datos;
  }
  datosMedico(): void {
    if (this.Orden.medicoReferente.nombres == 'SIN MEDICO REFERENTE') {
      this.id = null;
    } else {
      this.id = this.Orden.id;
      this.Medico=this.Orden.medicoReferente.nombres
      this.Nombres = this.Orden.medicoReferente.nombres;
      this.Apellidos = this.Orden.medicoReferente.apellidos;
      this.Especialidad = this.Orden.medicoReferente.especialidad;
      this.Correo = this.Orden.medicoReferente.correo;
      this.Whatsapp = this.data.medicoReferente.whatsapp;
      this.Direccion = this.Orden.medicoReferente.direccion;
      this.FechaNacimiento = this.Orden.medicoReferente.fechaNacimiento;
    }
  }

  abrirModalRegistrarMedico(): void {
    const modalRef = this.dialog.open(RegistrarMedicoModalComponent, {
      width: '800px',
      data:
        this.Orden.medicoReferente.nombres != 'SIN MEDICO REFERENTE'
          ? this.Orden.medicoReferente
          : null,
    });

    modalRef.afterClosed().subscribe((model) => {});
  }

  enviarResultados(): void {
    console.log('enviado');
  }
}
