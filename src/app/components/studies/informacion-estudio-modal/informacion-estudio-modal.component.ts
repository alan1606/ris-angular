import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FILES_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { MultimediaService } from 'src/app/services/multimedia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informacion-estudio-modal',
  templateUrl: './informacion-estudio-modal.component.html',
  styleUrls: ['./informacion-estudio-modal.component.css']
})
export class InformacionEstudioModalComponent implements OnInit {

  titulo: 'Información de estudio';
  estudio: VentaConceptos;
  multimedia: Multimedia[] = [];
  filesPath = FILES_PATH;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public modalRef: MatDialogRef<InformacionEstudioModalComponent>,
  private multimediaService: MultimediaService) { }

  ngOnInit(): void {
    this.estudio = this.data.estudio as VentaConceptos;

    this.multimediaService.buscarPorOrdenVentaId(this.estudio.ordenVenta.id).subscribe(
      multimedia => this.multimedia = multimedia,
      e => {
        Swal.fire("Error", "Error al obtener la multimedia", "error");
        this.modalRef.close();
      }
    );
  }

  cancelar() {
    this.modalRef.close();
  }

}
