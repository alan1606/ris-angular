import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, mergeMap } from 'rxjs';
import { Paciente } from 'src/app/models/paciente';
import { PacientesService } from 'src/app/services/pacientes.service';

@Component({
  selector: 'app-buscador-pacientes',
  templateUrl: './buscador-pacientes.component.html',
  styleUrls: ['./buscador-pacientes.component.css']
})
export class BuscadorPacientesComponent implements OnInit {

  @Output() pacienteEnviado = new EventEmitter<any>();

  constructor(
    private pacienteService : PacientesService
  ) { }

  paciente: Paciente;
  autocompleteControlPaciente = new FormControl();
  pacientesFiltrados: Paciente[] = [];

  ngOnInit(): void {
    this.autocompleteControlPaciente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombreCompleto),
      mergeMap(valor => valor ? this.pacienteService.filtrarPorNombre(valor) : [])
    ).subscribe(pacientes => this.pacientesFiltrados = pacientes);
  }

  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    const paciente = event.option.value as Paciente;
    this.paciente = paciente;

    event.option.value = "";
    event.option.deselect();
    event.option.focus();
    this.pacienteEnviado.emit(this.paciente);
  }

}
