import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FILES_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { MultimediaService } from 'src/app/services/multimedia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subir-archivo-estudio',
  templateUrl: './subir-archivo-estudio.component.html',
  styleUrl: './subir-archivo-estudio.component.css',
})
export class SubirArchivoEstudioComponent implements OnInit {
  @ViewChild('hiddenInput') hiddenInput: any;
  private multimediaService = inject(MultimediaService);
  public filesPath = FILES_PATH;
  private pdf: File;
  private multimedia: Multimedia = new Multimedia();
  public m: Multimedia[] = [];
  public modalRef = inject(MatDialogRef<SubirArchivoEstudioComponent>);
  public archivoSelecto: Multimedia = null;

  constructor(@Inject(MAT_DIALOG_DATA) public estudio: VentaConceptos) {}

  ngOnInit(): void {
    this.multimediaService
      .buscarPorOrdenVentaId(this.estudio.ordenVenta.id)
      .subscribe(
        (data) => {
          if (data) {
            this.m = data;
            console.log(this.m)
          }
        },
        (e) => {
          Swal.fire('Error', 'Error al obtener la multimedia', 'error');
          this.modalRef.close();
        }
      );
  }

  public seleccionarPdf(event): void {
    this.pdf = event.target.files[0];
    console.info(this.pdf);
    if (this.pdf.type.indexOf('pdf') < 0) {
      Swal.fire('Error', 'Solamente puede seleccionar un archivo pdf', 'error');
    } else {
      this.multimedia.ordenVenta = this.estudio.ordenVenta;
      this.multimediaService.subirPdf(this.multimedia, this.pdf).subscribe(
        (data) => {
          this.m.push(data);
          Swal.fire('Subido', 'PDF subido exitosamente', 'success');
        },
        () => Swal.fire('Error', 'No se pudo subir el PDF', 'error')
      );
    }
  }
  public eliminar(archivo: Multimedia) {
    Swal.fire({
      title: '¿Seguro que desea eliminar el archivo?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.multimediaService.eliminar(archivo.id).subscribe(
          () => {
            this.archivoSelecto = null;
            this.m = this.m.filter((l) => l.id !== archivo.id);
            Swal.fire('Éxito', 'El archivo ha sido eliminado', 'success');
          },
          () => {
            Swal.fire('Error', 'No se ha podido eliminar el archivo', 'error');
          }
        );
      }
    });
  }

  public expandir(archivo: Multimedia) {
    this.multimediaService.verDocumento(archivo).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  public triggerInput() {
    this.hiddenInput.nativeElement.click();
  }
  public verPdf(archivo: Multimedia): void {
    console.log(archivo);
    if(this.archivoSelecto?.id){
      if(this.archivoSelecto.id===archivo.id){
        this.archivoSelecto = null;
        return
      }
    }
    this.archivoSelecto = null;
    this.archivoSelecto = archivo;
  }
}
