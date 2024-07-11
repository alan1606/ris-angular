import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-visor-interpretacion',
  templateUrl: './visor-interpretacion.component.html',
  styleUrls: ['./visor-interpretacion.component.css'],
})
export class VisorInterpretacionComponent {
  enlace: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) private data: string) {
    this.enlace = data;
    console.log(data);
  }
}
