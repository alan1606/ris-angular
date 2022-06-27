import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VentaConceptosService } from '../../services/venta-conceptos.service';
import { VentaConceptos } from '../../models/venta-conceptos';
import { InterpretacionService } from '../../services/interpretacion.service';
import { Interpretacion } from '../../models/interpretacion';
import { BASE_ENDPOINT, FILES_PATH } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { MultimediaService } from 'src/app/services/multimedia.service';

@Component({
  selector: 'app-dictamen',
  templateUrl: './dictamen.component.html',
  styleUrls: ['./dictamen.component.css']
})
export class DictamenComponent implements OnInit {

  estudio: VentaConceptos;
  titulo: string = '';
  interpretacion: Interpretacion;
  enlacePdf: String;
  private multimedia: Multimedia = new Multimedia();
  archivosCargados: Promise<Boolean>;
  archivos: Multimedia[] = [];
  filesPath: string = FILES_PATH;

  constructor(private route: ActivatedRoute,
    private service: VentaConceptosService,
    private interpretacionService: InterpretacionService,
    private multimediaService: MultimediaService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idPacs: string = params.get('idPacs');
      if (idPacs) {
        this.service.buscarPorIdPacs(idPacs).subscribe(estudio => {
          this.estudio = estudio;
          this.titulo = `${this.estudio.institucion.nombre}: ${this.estudio.concepto.concepto} de ${this.estudio.paciente.nombreCompleto}`;
          this.cargarInterpretacion();
          this.cargarInterpretacionesPdf();
          this.enlacePdf = `${BASE_ENDPOINT}/ris/interpretaciones/estudio/${estudio.id}/pdf`;
        });
      }
    });
  }

  cargarInterpretacion(): void{
    this.interpretacionService.encontrarPorEstudioId(this.estudio.id).subscribe(interpretacion => {
      this.interpretacion = interpretacion[0];
    });
  }

  descargarPdf(): void{
    window.open(`${BASE_ENDPOINT}/ris/interpretaciones/estudio/${this.estudio.id}/pdf`);
  }

  descargarPdfExterno(enlace:string): void{
    window.open(enlace);
  }

  cargarInterpretacionesPdf(): void {
    this.multimediaService.buscarPorOrdenVentaId(this.estudio.ordenVenta.id).subscribe(multimedia => {
      this.archivos = multimedia.filter(foto => foto.tipo == 'INTERPRETACION');;
      this.archivosCargados = Promise.resolve(true);
      console.log(multimedia);
    }
    );
  }
}
