import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FILES_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';

@Component({
  selector: 'app-ver-foto-orden',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './ver-foto-orden.component.html',
  styleUrl: './ver-foto-orden.component.css'
})
export class VerFotoOrdenComponent implements OnInit {

 
  readonly dialogRef = inject(MatDialogRef<VerFotoOrdenComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(
    private multimediaService: MultimediaService
  ) {}

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
    this.multimediaService
      .buscarPorVentaConceptoId(idEstudio)
      .subscribe((multimedia) => {
        this.fotos = multimedia.filter((foto) => foto.tipo == 'IMAGEN');
        this.fotosCargadas.next(true);  // Emitir el valor true cuando la respuesta está lista, incluso si no hay fotos
      },
    err => this.fotosCargadas.next(false));  // Emitir false en caso de error
  }

  hasFotos(): boolean {
    return this.fotos.length > 0;
  }
}