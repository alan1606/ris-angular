import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FILES_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subir-foto-orden',
  templateUrl: './subir-foto-orden.component.html',
  styleUrls: ['./subir-foto-orden.component.css'],
})
export class SubirFotoOrdenComponent implements OnChanges {

  titulo: string;

  @Input()
  orden: OrdenVenta;
  
  private foto: File;
  private multimedia: Multimedia = new Multimedia();
  filesPath: string = FILES_PATH;

  fotos: Multimedia[] = [];
  fotosCargadas: Promise<Boolean>;

  constructor(
    private service: OrdenVentaService,
    private router: Router,
    private route: ActivatedRoute,
    private multimediaService: MultimediaService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("on init");
    // console.log(this.orden);
    this.titulo = `Subir foto de orden de ${this.orden.paciente.nombreCompleto}`;
    // console.log(this.titulo);
    this.cargarFotos();
  }

 

  seleccionarFoto(event): void {
    this.foto = event.target.files[0];
    // console.info(this.foto);
    if (
      this.foto.type.indexOf('png') < 0 &&
      this.foto.type.indexOf('jpeg') < 0 &&
      this.foto.type.indexOf('jpg') < 0
    ) {
      Swal.fire('Error', 'Solamente puede seleccionar imágenes', 'error');
    } else {
      this.multimedia.ordenVenta = this.orden;
      // console.log(this.orden);

      this.multimediaService.subirImagen(this.multimedia, this.foto).subscribe(
        (multimedia) => {
          this.fotos.push(multimedia);
          Swal.fire('Éxito', 'Imagen subida exitosamente', 'success');
        },
        (e) => Swal.fire('Error', 'No se pudo subir la imagen', 'error')
      );
    }
  }

  cargarFotos(): void {
    this.multimediaService
      .buscarPorOrdenVentaId(this.orden.id)
      .subscribe((multimedia) => {
        this.fotos = multimedia.filter((foto) => foto.tipo == 'IMAGEN');
        this.fotosCargadas = Promise.resolve(true);
        // console.log(multimedia);
      });
  }

  eliminar(foto: Multimedia) {
    Swal.fire({
      title: '¿Seguro que desea eliminar la foto?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.multimediaService.eliminar(foto.id).subscribe(
          (res) => {
            Swal.fire('Éxito', 'La foto ha sido eliminada', 'success');
            this.fotos = this.fotos.filter((filtrar) => filtrar.id != foto.id);
          },
          (error) => {
            Swal.fire('Error', 'No se ha podido eliminar la foto', 'error');
          }
        );
      }
    });
  }
}
