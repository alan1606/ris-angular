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
import { map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css'],
})
export class CheckInComponent implements OnInit {
  constructor(
    private pacienteService:PacientesService, 
    private router:Router, 
    private ventaConceptosService:VentaConceptosService,
    private dialog:MatDialog
    ) {}


  autocompleteControlPaciente = new UntypedFormControl('');

  ventaConceptos: VentaConceptos[] = null;
  pacientesFiltrados: Paciente[] = [];
  paciente:Paciente;
  ngOnInit(): void {
    this.autocompleteControlPaciente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombreCompleto),
      mergeMap(valor => valor ? this.pacienteService.filtrarPorNombre(valor) : [])
    ).subscribe(pacientes => {
      this.pacientesFiltrados = pacientes;
    });
  }

  verOrden(idPaciente:number){
    this.router.navigate([`/recepcion/checkin/ver/${idPaciente}`])
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
          this.paciente = paciente;
          this.autocompleteControlPaciente.setValue(this.paciente);
        }
      });

    
  }
}
