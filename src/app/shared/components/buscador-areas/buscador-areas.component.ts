import {Component,inject,OnInit,output,} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subscription, map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { AreasService } from 'src/app/services/areas.service';

@Component({
  selector: 'app-buscador-areas',
  templateUrl: './buscador-areas.component.html',
  styleUrls: ['./buscador-areas.component.css'],
})
export class BuscadorAreasComponent implements OnInit {
  areaEmit = output<Area>();
  areaService = inject(AreasService);
  subscription: Subscription;
  busqueda: string = '';
  autocompleteControlArea = new UntypedFormControl();
  area: Area = null;
  areasFiltradas: Area[] = [];

  ngOnInit(): void {
    this.autocompleteControlArea.valueChanges.pipe(map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        mergeMap((valor) =>valor ? this.areaService.filtrarPorNombre(valor) : [])).subscribe((areas) => {
        this.areasFiltradas = areas;
      });
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  areaSeleccionada(event: MatAutocompleteSelectedEvent) {
    this.area = event.option.value as Area;
    this.areaEmit.emit(this.area);
  }


}
