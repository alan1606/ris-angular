import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { Horario } from 'src/app/models/horario';
import { AreasService } from 'src/app/services/areas.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { HorarioService } from 'src/app/services/horario.service';

@Component({
  selector: 'app-horario-form',
  templateUrl: './horario-form.component.html',
  styleUrls: ['./horario-form.component.css']
})
export class HorarioFormComponent implements OnInit {

  autocompleteControlArea = new FormControl();
  areasFiltradas: Area[] = [];
  salas: EquipoDicom[] = [];

  horaInicio: string;
  horaFin: string;

  horario: Horario;

  dias: string[] = [
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO'
  ];

  diaSelected:string;

  constructor(
    private areasService: AreasService,
    private equiposDicomService: EquipoDicomService,
    private horariosService: HorarioService
  ) {
    this.horario = new Horario();
   }

  ngOnInit(): void {
    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areasService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => this.areasFiltradas = areas);
  
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

  cargarEquiposDicomDeAreaSeleccionada(areaId: number): void{
    this.equiposDicomService.filtrarPorArea(areaId).subscribe(salas => this.salas = salas);
  }

  editar(){

  }

  crear(){
    console.log(this.horaInicio);
    console.log(this.horaFin);
    console.log(this.diaSelected);
  }

}
