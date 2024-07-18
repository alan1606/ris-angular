import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  DOWNLOAD_WEASIS_MAC_LINK, DOWNLOAD_WEASIS_WINDOWS_LINK, FILES_PATH, VIEWER, WEASIS_VIEWER_PATH, ZIP_STUDIES_PATH } from 'src/app/config/app';
import { Interpretacion } from 'src/app/models/interpretacion';
import { Multimedia } from 'src/app/models/multimedia';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AntecedenteEstudioService } from 'src/app/services/antecedente-estudio.service';
import { InterpretacionService } from 'src/app/services/interpretacion.service';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { StudiesService } from 'src/app/services/studies.service';
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {

  titulo: string = '';
  estudio: VentaConceptos= new VentaConceptos();
  multimedia: Multimedia[] = [];
  filesPath = FILES_PATH;
  antecedentesJuntos: string = "";
  interpretacion: Interpretacion;
  interpretacionExterna: Promise<boolean>;

  constructor(private service: VentaConceptosService,
    private multimediaService: MultimediaService,
    private antecedenteEstudioService: AntecedenteEstudioService,
    private route: ActivatedRoute,
    private interpretacionService: InterpretacionService,
    private studiesService: StudiesService, 
    private router: Router,
    private http: HttpClient) { }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idPacs: string = params.get('idPacs');
      if (idPacs) {
        this.service.buscarPorIdPacs(idPacs).subscribe(estudio => {
          this.estudio = estudio;
          this.titulo = `${this.estudio.institucion.nombre}: ${this.estudio.concepto.concepto} de ${this.estudio.paciente.nombreCompleto}`;
          this.cargarMultimedia();
          this.cargarAntecedentes();
          this.cargarInterpretacion();
          this.cargarInterpretacionesPdf();
        });
      }
    });

  }

  cargarInterpretacion() {
    this.interpretacionService.encontrarPorEstudioId(this.estudio.id).subscribe(interpretacion => {
      this.interpretacion = interpretacion[0];
    });
  }

  cargarMultimedia() {
    this.multimediaService.buscarPorOrdenVentaId(this.estudio.ordenVenta.id).subscribe(
      multimedia => this.multimedia = multimedia,
      e => {
        Swal.fire("Error", "Error al obtener la multimedia", "error");
      }
    );
  }

  cargarInterpretacionesPdf(): void {
    this.multimediaService.buscarPorOrdenVentaId(this.estudio.ordenVenta.id).subscribe(multimedia => {
      let archivos: Multimedia[] = multimedia.filter(doc => doc.tipo == 'INTERPRETACION');
      if(archivos.length>0){
        this.interpretacionExterna = Promise.resolve(true);
      }
      else{
        this.interpretacionExterna = Promise.resolve(false);
      }
    }
    );
  }

  cargarAntecedentes() {
    this.antecedenteEstudioService.filtrarPorVentaConceptosId(this.estudio.id).subscribe(a => a.forEach(antecedente => {
      this.antecedentesJuntos += `${antecedente.antecedente.nombre}, `;
      console.log(antecedente.antecedente.nombre);
    }));
  }

  ver(estudio: VentaConceptos): void {
    window.open(`${VIEWER}${estudio.iuid}`);
  }

  descargarZip(estudio: VentaConceptos): void {
    window.open(`${ZIP_STUDIES_PATH}/${estudio.iuid}/?accept=application/zip;transfer-syntax=*`);
  }

  abrirConWeasis(estudio: VentaConceptos): void {
    window.open(`${WEASIS_VIEWER_PATH}${estudio.iuid}`);
  }

  descargarWeasisWindows(): void {
    window.open(DOWNLOAD_WEASIS_WINDOWS_LINK);
  }

  descargarWeasisMac(): void {
    window.open(DOWNLOAD_WEASIS_MAC_LINK);
  }

  verInterpretacion(estudio: VentaConceptos) {
    this.router.navigate([`/dictamen/${estudio.idPacs}`]);
  }


  expandir(multimedia: Multimedia) {
    this.multimediaService.verDocumento(multimedia).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  descargarImagenes(iuid: string){
    this.studiesService.buscarUrlsJpg(iuid).subscribe(urls => {
      for(let i=0; i<urls.length; i++){
        this.descargar(urls[i], i);
      }
    });
  }

 
  descargar(img, i){
    const imgUrl = img;
    const imgName = `${this.estudio.paciente.nombre} ${this.estudio.concepto.concepto} ${i+1}`;
    this.http.get(imgUrl, {responseType: 'blob' as 'json'})
      .subscribe((res: any) => {
        const file = new Blob([res], {type: res.type});

        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = imgName;

        // Version link.click() to work at firefox
        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));

        setTimeout(() => { // firefox
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      });
  }

}
