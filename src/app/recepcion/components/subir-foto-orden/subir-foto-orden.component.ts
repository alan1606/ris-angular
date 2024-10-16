import {
  Component,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class SubirFotoOrdenComponent implements OnChanges, OnInit {

  @Input()
  orden: OrdenVenta;
  public fotoInput: File = null;
  private foto: File;
  private multimedia: Multimedia = new Multimedia();
  filesPath: string = FILES_PATH;
  public subirFotoOrden= signal<boolean>(false)
  fotos: Multimedia[] = [];
  fotosCargadas: Promise<Boolean>;

  constructor(
    private service: OrdenVentaService,
    private route: ActivatedRoute,
    private multimediaService: MultimediaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idOrden: number = +params.get('id');

      if (!idOrden) {
        return;
      }
      this.subirFotoOrden.set(true)
      console.log(this.subirFotoOrden)
      this.service.ver(idOrden).subscribe(
        (orden) => {
          this.orden = orden;
          this.cargarFotos();
        },
        (error) => console.log(error)
      );
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("on init");
    // console.log(this.orden);
    this.cargarFotos();
  }

  seleccionarFoto(event): void {
    console.log(event);
    if (!event.target.files[0]) {
      console.log('no se selecciono nada');
      return;
    }
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
          this.fotoInput = null;
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
            this.fotoInput = null;
          },
          (error) => {
            Swal.fire('Error', 'No se ha podido eliminar la foto', 'error');
          }
        );
      }
    });
  }
}
