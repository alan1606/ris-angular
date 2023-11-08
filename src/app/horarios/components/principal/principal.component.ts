import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { AreasService } from 'src/app/services/areas.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  autocompleteControlArea = new FormControl();
  areasFiltradas: Area[] = [];
  salas: EquipoDicom[] = [];
  horarios:[] = [];

  constructor(
    private areasService: AreasService,
    private equiposDicomService: EquipoDicomService
  ) { }

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

  hola(id: number){

  }
}
