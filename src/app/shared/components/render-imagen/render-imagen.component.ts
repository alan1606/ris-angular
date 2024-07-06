import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { FILES_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { MultimediaService } from 'src/app/services/multimedia.service';

@Component({
  selector: 'app-render-imagen',
  templateUrl: './render-imagen.component.html',
  styleUrls: ['./render-imagen.component.css'],
})
export class RenderImagenComponent {
  img: Multimedia = new Multimedia();
  filesPath = FILES_PATH;
  templateForm: FormGroup;
  antecedentes: string = '';
  quillEditorModules = {};
  constructor(
    private matDialogRef: MatDialogRef<RenderImagenComponent>,
    private multimediaService: MultimediaService,
    @Inject(MAT_DIALOG_DATA) private data: Multimedia
  ) {
    this.img = data;
    this.templateForm = new FormGroup({
      textEditor: new FormControl(''),
    });

    this.quillEditorModules = {
      blotFormatter: {},
    };
    
    if (this.img.tipo == 'DOCUMENTO') {
      this.cargarPlantillaCardio();
    }
  }

  expandir(multimedia: Multimedia) {
    this.multimediaService.verDocumento(multimedia).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  cargarPlantillaCardio(): void {
    this.templateForm.get('textEditor').setValue(
      `<strong>Antecedentes:</strong> ${this.antecedentes}
    <br><br>
    <strong>*RITMO Y MEDICIONES*</strong><br>

    <strong>Ritmo:</strong>[  ], Frecuencia Cardiaca:[  ], Latidos por minuto.<br>
    <strong>Onda P:</strong>[  ]ms, [  ]mm. <br>
    <strong>Intervalo PR:</strong>[  ]ms, QRS:[  ]ms, Eje Eléctrico (AQRS)[  ], <br>
    <strong>Onda T:</strong>[  ].<br>
    <strong>Segmento ST:</strong>[  ].<br>
    <strong>Qt:</strong>[  ]ms, QTc:[  ]ms<br><br>


    <strong>OBSERVACIONES:</strong><br><br>
    <strong>INTERPRETACION:</strong>
    <br></br>
    <p><strong>El electrocardiograma es una herramienta diagnóstica que requiere la correlación clínica por parte del médico tratante</strong></p>
    `
    );
  }
}
