import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subscription, map, mergeMap } from 'rxjs';
import { DataService } from 'src/app/cortes/services/data.service';
import { Area } from 'src/app/models/area';
import { Cita } from 'src/app/models/cita';
import { AreasService } from 'src/app/services/areas.service';

@Component({
  selector: 'app-buscador-areas',
  templateUrl: './buscador-areas.component.html',
  styleUrls: ['./buscador-areas.component.css'],
})
export class BuscadorAreasComponent implements OnInit {

  @Output() citasFiltradasEmit = new EventEmitter<Cita[]>();
  @Output() areaEmit = new EventEmitter<Area>();

  constructor(
    private areaService: AreasService,
    private dataService: DataService
  ) {}



  private subscription: Subscription;
  busqueda: string = '';
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  autocompleteControlArea = new UntypedFormControl();
  area: Area = null;
  areasFiltradas: [] = [];

  ngOnInit(): void {
    this.subscription = this.dataService.citasData$.subscribe((data) => {
      this.citas = data.content;
    });

    this.autocompleteControlArea.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        mergeMap((valor) =>
          valor ? this.areaService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((areas) => {
        this.areasFiltradas = areas;
      });
  }

  filtrarAreas() {
    this.citasFiltradas = !this.area
      ? this.citas
      : this.citas.filter((cita) =>
          cita.estudio.concepto.area.nombre.includes(
            this.area.nombre.toUpperCase()
          )
        );
    console.log(this.citasFiltradas);
    this.citasFiltradasEmit.emit(this.citasFiltradas);
    this.areaEmit.emit(this.area);
    return;
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent) {
    this.area = event.option.value as Area;
    this.filtrarAreas();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
