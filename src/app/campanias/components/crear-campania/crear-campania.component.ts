import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Campania } from '../../models/campania';

@Component({
  selector: 'app-crear-campania',
  templateUrl: './crear-campania.component.html',
  styleUrls: ['./crear-campania.component.css']
})
export class CrearCampaniaComponent implements OnInit {

  titulo = "Crear campaña";
  campania: Campania;
  error: any;

  fechaInicioControl = new FormControl();
  fechaFinControl = new FormControl();

  constructor(
    private pipe: DatePipe
  ) { }

  ngOnInit(): void {
  }


  editar(): void{
  }

  crear(): void{
  }

  seleccionarFechaInicio(fecha: HTMLInputElement): void {
    const fechaFormulario = this.pipe.transform(new Date(fecha.value), 'dd-MM-yyyy');
    this.campania.fechaInicio = this.pipe.transform(new Date(fecha.value), 'yyyy-MM-dd');
  }

  seleccionarFechaFin(fecha: HTMLInputElement): void {
    const fechaFormulario = this.pipe.transform(new Date(fecha.value), 'dd-MM-yyyy');
    this.campania.fechaFin = this.pipe.transform(new Date(fecha.value), 'yyyy-MM-dd');
  }
}
