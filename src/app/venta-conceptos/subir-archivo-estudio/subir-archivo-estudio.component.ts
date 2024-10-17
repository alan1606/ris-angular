import {
  Component,
  Inject,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FILES_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
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
  private archivo: File;
  private multimedia: Multimedia = new Multimedia();
  public m: Multimedia[] = [];
  public modalRef = inject(MatDialogRef<SubirArchivoEstudioComponent>);
  public archivoSelecto: Multimedia = null;
  public loading = signal<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public estudio: VentaConceptos,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.buscarMultimedia();
  }

  private buscarMultimedia(): void {
    this.multimediaService
      .buscarPorOrdenVentaId(this.estudio.ordenVenta.id)
      .subscribe(
        (data) => {
          if (data) {
            this.m = data;
            console.log(this.m);
          }
        },
        (e) => {
          Swal.fire('Error', 'Error al obtener la multimedia', 'error');
          this.modalRef.close();
        }
      );
  }

  public seleccionarArchivo(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.archivo = event.target.files[0];
      console.info(this.archivo);
      if (this.archivo.type === 'application/pdf') {
        this.loading.set(true);
        console.log('Esto es un pdf');
        this.multimedia.ordenVenta = this.estudio.ordenVenta;
        this.multimediaService
          .subirPdf(this.multimedia, this.archivo)
          .subscribe(
            (data) => {
              this.m.push(data);
              this.loading.set(false);
              Swal.fire('Subido', 'PDF subido exitosamente', 'success');
            },
            () => Swal.fire('Error', 'No se pudo subir el PDF', 'info')
          );
      }
      if (
        this.archivo.type === 'application/x-zip-compressed' ||
        this.archivo.type === 'application/zip'
      ) {
        console.log('Esto es un zip');
        this.loading.set(true);
        let idOrdenVenta: number = this.estudio.ordenVenta.id;
        this.multimediaService.subirZip(idOrdenVenta, this.archivo).subscribe(
          (data) => {
            console.log(data);
            this.buscarMultimedia();
            this.loading.set(false);
          },
          (error) => {
            console.log(error);
            this.alertaService.info(
              'A ocurrido un problema',
              'No se ha podido subir el archivo'
            );
            this.loading.set(false);
          }
        );
      } else {
        console.log('archivo extraño');
        Swal.fire({
          icon: 'info',
          title: '¡¡¡Aviso!!!',
          text: 'Solamente se pueden subir archivos pdf.',
        });
        return;
      }
    }
    return;
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

  public expandir(archivo: Multimedia): void {
    this.multimediaService.verDocumento(archivo).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  public descargarZip(archivo: Multimedia): void {
    window.open(this.filesPath + archivo.ruta, 'blank');
  }

  public triggerInput(): void {
    this.hiddenInput.nativeElement.click();
  }
  public verPdf(archivo: Multimedia): void {
    console.log(archivo);
    if (this.archivoSelecto?.id) {
      if (this.archivoSelecto.id === archivo.id) {
        this.archivoSelecto = null;
        return;
      }
    }
    this.archivoSelecto = null;
    this.archivoSelecto = archivo;
  }
}
