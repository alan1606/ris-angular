import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaConceptosService } from '../../../services/venta-conceptos.service';
import { VentaConceptos } from '../../../models/venta-conceptos';
import { InterpretacionService } from '../../../services/interpretacion.service';
import { Interpretacion } from '../../../models/interpretacion';
import { BASE_ENDPOINT, FILES_PATH, VIEWER } from 'src/app/config/app';
import { Multimedia } from 'src/app/models/multimedia';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { VisorInterpretacionComponent } from 'src/app/dictador/components/visor-interpretacion/visor-interpretacion.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dictamen',
  templateUrl: './dictamen.component.html',
  styleUrls: ['./dictamen.component.css'],
})
export class DictamenComponent implements OnInit {
  estudio: VentaConceptos = new VentaConceptos();
  titulo: string = '';
  interpretacion: Interpretacion;
  enlacePdf: string = '';
  archivosCargados: Promise<Boolean>;
  archivos: Multimedia[] = [];
  filesPath: string = FILES_PATH;
  isMobile = false;
  viewerURL: string = `${VIEWER}`;
  noDicomStudies: Multimedia[] = [];
  constructor(
    private route: ActivatedRoute,
    private service: VentaConceptosService,
    private interpretacionService: InterpretacionService,
    private multimediaService: MultimediaService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (screen.width <= 1023) {
      this.isMobile = true;
    }
    this.route.paramMap.subscribe((params) => {
      const idPacs: string = params.get('idPacs');
      if (idPacs) {
        this.service.buscarPorIdPacs(idPacs).subscribe((estudio) => {
          this.estudio = estudio;
          this.titulo = `${this.estudio.institucion.nombre}: ${this.estudio.concepto.concepto} de ${this.estudio.paciente.nombreCompleto}`;
          this.cargarInterpretacion();
          this.cargarInterpretacionesPdf();

          if (!estudio.concepto.dicom) {
            this.getNoDicomStudiesDocuments();
          }
        });
      }
    });
  }

  cargarInterpretacion(): void {
    this.interpretacionService
      .encontrarPorEstudioId(this.estudio.id)
      .subscribe((interpretacion) => {
        if (interpretacion.length > 0) {
          this.interpretacion = interpretacion[0];
          this.enlacePdf = `${BASE_ENDPOINT}/ris/interpretaciones/estudio/${this.estudio.id}/pdf`;
          console.log('sexo', interpretacion);
        }
      });
  }

  descargarPdf(): void {
    window.open(
      `${BASE_ENDPOINT}/ris/interpretaciones/estudio/${this.estudio.id}/pdf`
    );
  }

  descargarPdfExterno(enlace: string): void {
    window.open(enlace);
  }

  getNoDicomStudiesDocuments(): void {
    console.log("Getting no dicom documents")
    this.multimediaService
      .buscarPorOrdenVentaId(this.estudio.ordenVenta.id)
      .subscribe((multimedia) => {
        this.noDicomStudies = multimedia.filter(
          (doc) => doc.tipo === 'DOCUMENTO'
        );
        console.log(this.noDicomStudies)
      });
  }

  cargarInterpretacionesPdf(): void {
    this.multimediaService
      .buscarPorOrdenVentaId(this.estudio.ordenVenta.id)
      .subscribe(
        (multimedia) => {
          // if (this.estudio.concepto.area.id === 120) {
          //   console.log("entro el if")
          //   this.archivos = multimedia.filter(
          //     (foto) => foto.tipo == 'DOCUMENTO'
          //   );
          //   if (this.archivos.length > 0) {
          //     this.archivosCargados = Promise.resolve(true);
          //   } else {
          //     this.archivosCargados = Promise.resolve(false);
          //   }
          //   console.log(this.archivos);
          // }
          this.archivos = multimedia.filter(
            (foto) => foto.tipo == 'INTERPRETACION'
          );
          if (this.archivos.length > 0) {
            this.archivosCargados = Promise.resolve(true);
          } else {
            this.archivosCargados = Promise.resolve(false);
          }
        },
        (error) => {
          this.archivosCargados = Promise.resolve(false);
        }
      );
  }

  abrir(estudio: VentaConceptos): void {
    this.router.navigate(['/resultados/', estudio.idPacs]);
  }

  abrirOhif(estudio: VentaConceptos): void {
    if (this.isMobile && estudio.concepto.area.nombre === 'MASTOGRAFIA') {
      this.viewerURL = 'https://viewerv2.diagnocons.com/viewer/';
    }
    window.open(`${this.viewerURL}${estudio.iuid}`);
  }
  verInterpretacion(enlace: string): void {
    console.log(enlace);
    this.dialog.open(VisorInterpretacionComponent, {
      data: enlace,
      width: '80vw',
      height: '90vh',
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (screen.width <= 999) {
      this.isMobile = true;
      return;
    }
    this.isMobile = false;
    return;
  }
}
