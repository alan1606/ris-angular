import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { AreasService } from 'src/app/services/areas.service';

@Component({
  selector: 'app-instrucciones-area',
  templateUrl: './instrucciones-area.component.html',
  styleUrls: ['./instrucciones-area.component.css']
})
export class InstruccionesAreaComponent implements OnInit {

  autocompleteControlArea = new UntypedFormControl();
  areasFiltradas: Area[] = [];
  area: Area;


  constructor(
    private areaService: AreasService
  ) { }

  ngOnInit(): void {
    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areaService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => {
      this.areasFiltradas = areas;
    });
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent){
    this.area = event.option.value as Area;

    event.option.deselect();
    event.option.focus();
  }
}
