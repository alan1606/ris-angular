import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-campo-fecha',
  templateUrl: './campo-fecha.component.html',
  styleUrls: ['./campo-fecha.component.css'],
})
export class CampoFechaComponent {
  @Input() public label: string;
  @Output() public fecha: EventEmitter<string> = new EventEmitter();
  fechaControl: FormControl = new FormControl();

  fechaSeleccionada(): void {
    console.log(this.fechaControl.value);
    let fecha = this.fechaControl.value.toISOString().slice(0, 10);
    this.fecha.emit(fecha);
  }
}
