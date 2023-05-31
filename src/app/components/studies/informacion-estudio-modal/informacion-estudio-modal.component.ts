import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FILES_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AntecedenteEstudioService } from 'src/app/services/antecedente-estudio.service';
import { MultimediaService } from 'src/app/services/multimedia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informacion-estudio-modal',
  templateUrl: './informacion-estudio-modal.component.html',
  styleUrls: ['./informacion-estudio-modal.component.css']
})
export class InformacionEstudioModalComponent implements OnInit {

  estudio: VentaConceptos;
  multimedia: Multimedia[] = [];
  filesPath = FILES_PATH;
  titulo: string; 
  antecedentesJuntos: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public modalRef: MatDialogRef<InformacionEstudioModalComponent>,
  private multimediaService: MultimediaService,
  private antecedenteEstudioService: AntecedenteEstudioService) { }

  ngOnInit(): void {
    this.estudio = this.data.estudio as VentaConceptos;
    this.titulo = `${this.estudio.institucion.nombre}: ${this.estudio.concepto.concepto} de ${this.estudio.paciente.nombreCompleto}`;

    this.multimediaService.buscarPorOrdenVentaId(this.estudio.ordenVenta.id).subscribe(
      multimedia => this.multimedia = multimedia,
      e => {
        Swal.fire("Error", "Error al obtener la multimedia", "error");
        this.modalRef.close();
      }
    );

    this.antecedenteEstudioService.filtrarPorVentaConceptosId(this.estudio.id).subscribe(a => a.forEach(antecedente => {
      this.antecedentesJuntos += `${antecedente.antecedente.nombre}, `;
      console.log(antecedente.antecedente.nombre);
    }));
  }

  cancelar() {
    this.modalRef.close();
  }

  eliminar(archivo: Multimedia){
    Swal.fire({
      title: '¿Seguro que desea eliminar el archivo?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.multimediaService.eliminar(archivo.id).subscribe(res => {
          Swal.fire('Éxito', 'El archivo ha sido eliminado', 'success');
          //this.multimedia = this.multimedia.filter();
        }, error =>{
          Swal.fire('Error', 'No se ha podido eliminar el archivo', 'error');
        });
      }
    })
  }

  expandir(multimedia: Multimedia) {
    this.multimediaService.verDocumento(multimedia).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

}
