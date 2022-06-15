import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Area } from '../../models/area';
import { Paciente } from '../../models/paciente';
import { VentaConceptosService } from '../../services/venta-conceptos.service';
import { AreasService } from '../../services/areas.service';
import { PacientesService } from '../../services/pacientes.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, flatMap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { VentaConceptos } from '../../models/venta-conceptos';
import { WorklistService } from '../../services/worklist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-worklist',
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.css']
})
export class WorklistComponent implements OnInit {

  lista: VentaConceptos[];
  autocompleteControl = new FormControl();
  autocompleteControlPaciente = new FormControl();
  areasFiltradas: Area[] = [];
  pacientesFiltrados: Paciente[] = [];
  fechaInicio = '';
  fechaFin = '';
  titulo: string;

  constructor(private service: VentaConceptosService,
    @Inject(AreasService) private areasService: AreasService,
    @Inject(PacientesService) private pacienteService: PacientesService,
    private pipe: DatePipe,
    public dialog: MatDialog,
    private worklistService: WorklistService) {
    this.titulo = "Listado de estudios";
    }

  ngOnInit(): void {
    this.buscarEstudiosDeHoy();

    this.autocompleteControl.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      flatMap(valor => valor ? this.areasService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => this.areasFiltradas = areas);

    this.autocompleteControlPaciente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombreCompleto),
      flatMap(valor => valor ? this.pacienteService.filtrarPorNombre(valor) : [])
    ).subscribe(pacientes => this.pacientesFiltrados = pacientes);

  }


  mostrarNombre(area?: Area): string {
    return area ? area.nombre : '';
  }

  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  buscarEstudiosDeHoy(): void {
    this.service.filtrarDiaDeHoy().subscribe(estudios => this.lista = estudios,
      e => {
        if (e.status === 404) {
          this.lista = [];
        }
      });
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent): void {
    const area = event.option.value as Area;

    if(this.errorEnFechas()){
      this.crearRangoDeDosMesesEnBaseAHoy();
    }
  
    this.service.filtrarRangoYArea(this.fechaInicio, this.fechaFin, area.id).subscribe(estudios => {
      this.lista = estudios;
    },
      e => {
        if (e.status === 404) {
          this.lista = [];
        }
      }
    );

    this.autocompleteControl.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    const paciente = event.option.value as Paciente;

    if(this.errorEnFechas()){
      this.crearRangoDeDosMesesEnBaseAHoy();
    }
  
    this.service.filtrarRangoYPaciente(this.fechaInicio, this.fechaFin, paciente.id).subscribe(estudios => {
      this.lista = estudios;
    },
      e => {
        if (e.status === 404) {
          this.lista = [];
        }
      }
    );

    this.autocompleteControlPaciente.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  private errorEnFechas(): boolean{
    return this.fechaInicio === '' || this.fechaFin === '';
  }

  private crearRangoDeDosMesesEnBaseAHoy(): void{
    this.fechaInicio = this.sumarMesesAFechaDeHoy(-1);
    this.fechaFin = this.sumarMesesAFechaDeHoy(1);
    console.log(this.fechaInicio + " " + this.fechaFin);
  }

  private sumarMesesAFechaDeHoy(cantidad: number): string{
    const hoy = new Date(Date.now());
    const sumada = new Date(hoy.getFullYear(), hoy.getMonth() + cantidad, hoy.getDate());
    return this.pipe.transform(sumada, 'yyyy-MM-dd');
  }

 
  buscarPorFecha(fechaInicio: HTMLInputElement, fechaFin: HTMLInputElement): void {
    if (fechaInicio.value !== '' && fechaFin.value !== '') {
      this.fechaInicio = this.pipe.transform(new Date(fechaInicio.value), 'yyyy-MM-dd');
      this.fechaFin = this.pipe.transform(new Date(fechaFin.value), 'yyyy-MM-dd');

      console.log(this.fechaInicio + " " + this.fechaFin)

      this.service.filtrarRango(this.fechaInicio, this.fechaFin).subscribe(estudios => 
        this.lista = estudios,
        e => {
          if (e.status === 404) {
            this.lista = [];
          }
        });
    }
    else{
      this.fechaInicio = '';
      this.fechaFin = '';
    }
  }

  enviar(estudio: VentaConceptos): void{
    this.worklistService.procesarEstudio(estudio.id).subscribe(respuesta =>{
      Swal.fire('Éxito', 'Procesado correctamente', "success");
    },error =>{
      console.log(error);
      Swal.fire('Error', 'No se ha podido procesar la worklist', 'error');
    });
  }


}
