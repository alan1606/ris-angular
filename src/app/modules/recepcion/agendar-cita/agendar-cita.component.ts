import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { flatMap, map } from 'rxjs';
import { Institucion } from 'src/app/models/institucion';
import { Paciente } from 'src/app/models/paciente';
import { InstitucionService } from 'src/app/services/institucion.service';
import { PacientesService } from 'src/app/services/pacientes.service';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.css']
})
export class AgendarCitaComponent implements OnInit {

  constructor(
    private pacienteService: PacientesService,
    private institucionService: InstitucionService
  ) {   }

  titulo = "Agendar cita";
  autocompleteControlPaciente = new FormControl();
  paciente: Paciente;
  pacientesFiltrados: Paciente[] = [];
  instituciones: Institucion[] = [];
  fecha: String;

  ngOnInit(): void {
    this.autocompleteControlPaciente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombreCompleto),
      flatMap(valor => valor ? this.pacienteService.filtrarPorNombre(valor) : [])
    ).subscribe(pacientes => this.pacientesFiltrados = pacientes);


    this.institucionService.listar().subscribe(
      instituciones => this.instituciones = instituciones
    );
  }


  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
     this.paciente = event.option.value as Paciente;

   // this.autocompleteControlPaciente.setValue(this.paciente);
    event.option.deselect();
    event.option.focus();


  }

  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }


  agendar(){

  }

  abrirModalRegistrarPaciente(){
    
  }


  
}
