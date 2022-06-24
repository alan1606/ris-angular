import { Component, OnInit } from '@angular/core';
import { Multimedia } from '../../../models/multimedia';
import Swal from 'sweetalert2';
import { FILES_PATH } from '../../../config/app';
import { VentaConceptosService } from '../../../services/venta-conceptos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MultimediaService } from '../../../services/multimedia.service';
import { VentaConceptos } from '../../../models/venta-conceptos';

@Component({
  selector: 'app-subir-interpretacion',
  templateUrl: './subir-interpretacion.component.html',
  styleUrls: ['./subir-interpretacion.component.css']
})
export class SubirInterpretacionComponent implements OnInit {
  
  titulo: string;
  estudio: VentaConceptos;
  private archivo: File;
  private multimedia: Multimedia = new Multimedia();
  filesPath: string = FILES_PATH;

  archivos: Multimedia[] = [];
  archivosCargados: Promise<Boolean>;

  constructor(private service: VentaConceptosService,
    private router: Router,
    private route: ActivatedRoute,
    private multimediaService: MultimediaService) {
      this.route.paramMap.subscribe(params => {
        const idPacs: string = params.get('idPacs');
        if(idPacs){
          this.service.buscarPorIdPacs(idPacs).subscribe(estudio => {
            this.estudio = estudio;
            this.titulo = `Subir interpretación de ${this.estudio.paciente.nombreCompleto} : ${this.estudio.concepto.concepto}`;
            this.cargarArchivos();
          });
        }
      });
    
  }

  ngOnInit(): void {}

  seleccionarArchivo(event): void {
    this.archivo = event.target.files[0];
    console.info(this.archivo);
    if(this.archivo.type.indexOf('pdf') < 0){
      Swal.fire('Error', 'Solamente puede seleccionar archivos PDF', 'error');
    }
    else{
      this.multimedia.ordenVenta = this.estudio.ordenVenta;
      console.log(this.estudio.ordenVenta);

      this.multimediaService.subirInterpretacionPdf(this.multimedia, this.archivo).subscribe(multimedia =>{
        this.archivos.push(multimedia);
        Swal.fire('Éxito', 'Interpretación subida exitosamente', 'success');
        this.estudio.estado = 'INTERPRETADO';
        this.actualizarEstudio();
        this.router.navigate([`/medico-radiologo/${this.estudio.medicoRadiologo.token}`]);
      },
        e =>
          Swal.fire('Error', 'No se pudo subir la interpretación', 'error'),
      );
    }
  }
  

  cargarArchivos(): void {
    this.multimediaService.buscarPorOrdenVentaId(this.estudio.ordenVenta.id).subscribe(multimedia => {
      this.archivos = multimedia.filter(foto => foto.tipo == 'INTERPRETACION');;
      this.archivosCargados = Promise.resolve(true);
      console.log(multimedia);
    }
    );
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
          this.archivos = this.archivos.filter(filtrar => filtrar.id != archivo.id);


          //Si longitud de arreglo  = 0, entonces poner estado de estudio en interpretando




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

  private actualizarEstudio(): void {
    this.service.editar(this.estudio).subscribe(res =>{
      console.log('Estudio actualizado');
    }, error =>{
      console.log('No se pudo actualizar el estado del estudio');
    });
  }
}
