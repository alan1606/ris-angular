import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { FILES_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { MultimediaService } from 'src/app/services/multimedia.service';

@Component({
  selector: 'app-ver-foto-orden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-foto-orden.component.html',
  styleUrl: './ver-foto-orden.component.css',
})
export class VerFotoOrdenComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<VerFotoOrdenComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(private multimediaService: MultimediaService) {}

  ngOnInit(): void {
    const idEstudio = this.data.idEstudio;
    console.log(idEstudio);

    if (!idEstudio) {
      return;
    }
    this.cargarFotos(idEstudio);
  }
  filesPath: string = FILES_PATH;
  fotos: Multimedia[] = [];
  fotosCargadas = new BehaviorSubject<Boolean>(false);

  cargarFotos(idEstudio: number): void {
    this.multimediaService.buscarPorVentaConceptoId(idEstudio).subscribe(
      (multimedia) => {
        this.fotos = multimedia.filter((foto) => foto.tipo == 'IMAGEN');
        this.angles = new Array(this.fotos.length).fill(0);
        this.fotosCargadas.next(true);
      },
      (err) => this.fotosCargadas.next(false)
    );
  }

  hasFotos(): boolean {
    return this.fotos.length > 0;
  }

  angles: number[] = [];

  get rotation() {
    return this.angles.map((angle) => `rotate(${angle}deg)`);
  }

  rotateImage(index: number): void {
    console.log(this.angles);
    this.angles[index] = (this.angles[index] + 90) % 360;
  }
}
