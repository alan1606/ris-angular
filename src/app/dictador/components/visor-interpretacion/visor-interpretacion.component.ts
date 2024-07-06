import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-visor-interpretacion',
  templateUrl: './visor-interpretacion.component.html',
  styleUrls: ['./visor-interpretacion.component.css'],
})
export class VisorInterpretacionComponent {
  enlace: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) private data: string) {
    this.enlace = data;
    console.log(data)
  }
}
