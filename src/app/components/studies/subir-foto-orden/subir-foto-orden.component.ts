import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMAGE_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import Swal from 'sweetalert2';
import { CommonFormComponent } from '../../common-form.component';

@Component({
  selector: 'app-subir-foto-orden',
  templateUrl: './subir-foto-orden.component.html',
  styleUrls: ['./subir-foto-orden.component.css']
})
export class SubirFotoOrdenComponent extends CommonFormComponent<OrdenVenta, OrdenVentaService> implements OnInit {

  private foto: File;
  private multimedia: Multimedia = new Multimedia();
  imagePath = IMAGE_PATH;

  constructor(service: OrdenVentaService,
    router: Router,
    route: ActivatedRoute,
    private multimediaService: MultimediaService) {
      
    super(service, router, route);
    this.titulo = "Subir foto de órden";
    this.redirect = '/';
    this.nombreModel = OrdenVenta.name;
    console.log(this.model);
  }

  seleccionarFoto(event): void {
    this.foto = event.target.files[0];
    console.info(this.foto);
    if(this.foto.type.indexOf('png') < 0 && this.foto.type.indexOf('jpeg') < 0 && this.foto.type.indexOf('jpg') < 0){
      Swal.fire('Error', 'Solamente puede seleccionar imágenes', 'error');
    }
    else{
      this.multimedia.ordenVenta = this.model;
      console.log(this.model);

      this.multimediaService.subirImagen(this.multimedia, this.foto).subscribe(multimedia =>
        Swal.fire('Éxito', 'Imagen subida exitosamente', 'success'),
        e =>
          Swal.fire('Error', 'No se pudo subir la imagen', 'error'),
      );
    }
  }

}
