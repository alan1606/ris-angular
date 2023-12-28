import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { PacientesService } from 'src/app/services/pacientes.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { PacienteOrdenesComponent } from './paciente-ordenes/paciente-ordenes.component';
import { Paciente } from 'src/app/models/paciente';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { catchError, debounceTime, distinctUntilChanged, map, mergeMap, switchMap } from 'rxjs';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css'],
})
export class CheckInComponent implements OnInit {
  constructor(
    private pacienteService:PacientesService, 
    private dialog:MatDialog,
    ) {}
  autocompleteControlPaciente = new UntypedFormControl('');      
  ventaConceptos: VentaConceptos[] = null;
  pacientesFiltrados: Paciente[] = [];
  paciente:Paciente;
  ngOnInit(): void {
    this.autocompleteControlPaciente.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap(valor => {
        const nombreCompleto = typeof valor === 'string' ? valor : valor.nombreCompleto;
        return valor ? this.pacienteService.filtrarPorNombre(nombreCompleto) : [];
      }),
      catchError(error => {
        console.error('Error en la búsqueda de pacientes:', error);
        return [];
      })
    ).subscribe(pacientes => {
      this.pacientesFiltrados = pacientes;
    });
  }
  
  mostrarNombrePaciente(paciente: Paciente): string {
    return paciente && paciente.nombre ? paciente.nombreCompleto : '';
  }
  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    this.paciente = event.option.value as Paciente;
    event.option.deselect();
    event.option.focus();
  }
  
  abrirModalPacienteOrdenes() {
    const modalRef = this.dialog.open(PacienteOrdenesComponent,
      {
        width: "1000px",
        data: {paciente:this.paciente?.id ? this.paciente : null  }
      });
      
      modalRef.afterClosed().subscribe(paciente => {
        if(paciente){
          this.paciente = null;
          this.autocompleteControlPaciente.setValue(this.paciente);
        }
      });

    
  }
}
