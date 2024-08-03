import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import {pdfDefaultOptions} from 'ngx-extended-pdf-viewer'
@Component({
  selector: 'app-visor-interpretacion',
  templateUrl: './visor-interpretacion.component.html',
  styleUrls: ['./visor-interpretacion.component.css'],
})
export class VisorInterpretacionComponent {
  enlace: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) private data: string) {
    console.log(data)
    // pdfDefaultOptions.assetsFolder ='bleeding-edge'
    this.enlace = data;
    
  }
}
