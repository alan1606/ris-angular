import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { Horario } from 'src/app/models/horario';
import { AreasService } from 'src/app/services/areas.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { HorarioService } from 'src/app/services/horario.service';
import { GenerarCitasModalComponent } from '../generar-citas-modal/generar-citas-modal.component';
import { CitaService } from 'src/app/services/cita.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  autocompleteControlArea = new FormControl();
  areasFiltradas: Area[] = [];
  salas: EquipoDicom[] = [];
  horarios: Horario[] = [];
  sala: EquipoDicom;

  formulario: FormGroup;


  constructor(
    private areasService: AreasService,
    private equiposDicomService: EquipoDicomService,
    private horariosService: HorarioService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public citaService: CitaService
  ) {
    this.formulario = this.fb.group({
      salaControl: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areasService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => this.areasFiltradas = areas);

    this.formulario.get('salaControl').valueChanges.subscribe(value => {
      this.buscarHorariosPorSala(value);
      this.equiposDicomService.ver(value).subscribe(sala => this.sala = sala,
        err => console.log(err));
    });

  }


  seleccionarArea(event: MatAutocompleteSelectedEvent): void {
    const area = event.option.value as Area;

    event.option.deselect();
    event.option.focus();

    this.cargarEquiposDicomDeAreaSeleccionada(area.id);
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  cargarEquiposDicomDeAreaSeleccionada(areaId: number): void {
    this.equiposDicomService.filtrarPorArea(areaId).subscribe(salas => this.salas = salas);
  }

  buscarHorariosPorSala(id: any) {
    this.horariosService.filtrarPorSalaId(id).subscribe(
      horarios => {
        this.horarios = horarios;
        if(this.horarios.length == 0){
          Swal.fire("Sin registros", "No se han registrado horarios para esa sala, agréguelos en el botón de +", "info");
        }
      },
      err => { console.error(err) }
    );
  }

  abrirGenerarCitas(): void {
    const dialogRef = this.dialog.open(GenerarCitasModalComponent);

    dialogRef.afterClosed().subscribe(({fechaInicio, fechaFin}) => {
      if(!fechaInicio || !fechaFin){
        return;
      }
      console.log(fechaInicio,fechaFin);
      Swal.fire("Espere un momento", "Favor de esperar un momento en esta pantalla para que se terminen de generar las citas", "warning");
      this.citaService.generar(fechaInicio,fechaFin).subscribe(() => {
        Swal.fire("Generado", "Citas generadas exitosamente", "success");
      },
      (error) => {
        Swal.fire("Error", error.error.detail, "error");
        console.log(error);
      });
    });
  }

  abrirGenerarCitasPorSala(): void {
    const dialogRef = this.dialog.open(GenerarCitasModalComponent);

    dialogRef.afterClosed().subscribe(({fechaInicio, fechaFin}) => {
      if(!fechaInicio || !fechaFin){
        return;
      }
      console.log(fechaInicio,fechaFin);
      Swal.fire("Espere un momento", "Favor de esperar un momento en esta pantalla para que se terminen de generar las citas", "warning");
      this.citaService.generarPorSala(this.sala.id, fechaInicio,fechaFin).subscribe(() => {
        Swal.fire("Generado", "Citas generadas exitosamente", "success");
      },
      (error) => {
        Swal.fire("Error", error.error.detail, "error");
        console.log(error);
      });
    });
  }

}
