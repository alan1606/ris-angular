import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-campo-fecha-rango',
  templateUrl: './campo-fecha-rango.component.html',
  styleUrls: ['./campo-fecha-rango.component.css'],
})
export class CampoFechaRangoComponent {
  @Output() fechas: any = new EventEmitter();
  range = new FormGroup({
    start: new FormControl<Date>(null),
    fin: new FormControl<Date>(null),
  });

  fechasSeleccionadas(): void {
    let inicio = this.range.value.start.toISOString().slice(0, 10);

    let fin = this.range.value.fin.toISOString().slice(0, 10);
    let fechas = { inicio, fin };
    this.fechas.emit(fechas);
  }
}
