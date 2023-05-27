import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOWNLOAD_WEASIS_MAC_LINK, DOWNLOAD_WEASIS_WINDOWS_LINK, VIEWER, WEASIS_VIEWER_PATH, ZIP_STUDIES_PATH, FILES_PATH } from '../../config/app';
import { Multimedia } from '../../models/multimedia';

import { VentaConceptos } from '../../models/venta-conceptos';
import { AntecedenteEstudioService } from '../../services/antecedente-estudio.service';
import { InterpretacionService } from '../../services/interpretacion.service';
import { MultimediaService } from '../../services/multimedia.service';
import { VentaConceptosService } from '../../services/venta-conceptos.service';
import Swal from 'sweetalert2';

import { SendMailService } from '../../services/send-mail.service';
declare const webkitSpeechRecognition: any;

@Component({
  selector: 'app-dictador',
  templateUrl: './dictador.component.html',
  styleUrls: ['./dictador.component.scss']
})


export class DictadorComponent implements OnInit {

  estudio: VentaConceptos;
  antecedentes: string = '';
  multimedia: Multimedia[] = [];
  multimediaCargada: Promise<Boolean>;
  estudiosDeOrden: VentaConceptos[]

  filesPath = FILES_PATH;

  constructor(private route: ActivatedRoute,
    private ventaConceptosService: VentaConceptosService,
    private antecedenteEstudioService: AntecedenteEstudioService,
    private router: Router,
    private interpretacionService: InterpretacionService,
    private multimediaService: MultimediaService,
    private mailService: SendMailService) {
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const idVentaConcepto: number = + params.get('idVentaConcepto');
      if (idVentaConcepto) {
        this.ventaConceptosService.ver(idVentaConcepto).subscribe(estudio => {
          this.estudio = estudio;
          this.cargarAntecedentesInicial();
          this.cargarMultimedia();
          this.cargarEstudiosDeOrden();
          console.log(estudio);
        }, error => {
          this.router.navigate(['/']);
        });
      }
    });

  }

  cargarPlantillaCardio(): void {

    /*
    console.log(this.antecedentes);
    const jsonDoc = (toDoc(`<strong>Antecedentes:</strong> ${this.antecedentes}
    <br><br>
    <strong>*RITMO Y MEDICIONES*</strong><br>

    <strong>Ritmo:</strong>[  ], Frecuencia Cardiaca:[  ], Latidos por minuto.<br>
    <strong>Onda P:</strong>[  ]ms, [  ]mm. <br>
    <strong>Intervalo PR:</strong>[  ]ms, QRS:[  ]ms, Eje Eléctrico (AQRS)[  ], <br>
    <strong>Onda T:</strong>[  ].<br>
    <strong>Segmento ST:</strong>[  ].<br>
    <strong>Qt:</strong>[  ]ms, QTc:[  ]ms<br><br>


    <strong>OBSERVACIONES:</strong><br><br>
    <strong>INTERPRETACION:</strong>
    <br></br>
    <p><strong>El electrocardiograma es una herramienta diagnóstica que requiere la correlación clínica por parte del médico tratante</strong></p>
    `));

    */
  }



  cargarMultimedia() {
    this.multimediaService.buscarPorOrdenVentaId(this.estudio.ordenVenta.id).subscribe(multimedia => {
      this.multimedia = multimedia;
      this.multimediaCargada = Promise.resolve(true);
      console.log(multimedia);
    },
    error => {
      console.log("Error al cargar multimedia");
      Promise.resolve(false);
    }
    );
  }


  cargarAntecedentes() {
    this.antecedentes = '';
    this.antecedenteEstudioService.filtrarPorVentaConceptosId(this.estudio.id).subscribe(a => a.forEach(antecedente => {
      this.antecedentes += `${antecedente.antecedente.nombre} \n`;
      if (this.estudio.concepto.area.nombre == 'CARDIOLOGIA') {
        this.cargarPlantillaCardio();
      }
    },
    error => {
      console.log("Error al cargar antecedentes");
    }));
  }

  cargarAntecedentesInicial() {
    this.antecedenteEstudioService.filtrarPorVentaConceptosId(this.estudio.id).subscribe(a => a.forEach(antecedente => {
      this.antecedentes += `${antecedente.antecedente.nombre} \n`;
      console.log("Cargando antecedentes iniciales");
    },
    error => {
      console.log("Error al cargar antecedentes iniciales");
    }));

  }

  ver(estudio: VentaConceptos): void {
    window.open(`${VIEWER}/${estudio.iuid}`);
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

  guardar() {

      this.enviarAvisoInterpretacionHechaACorreo();

      this.marcarEstudiosDeOrdenInterpretados();

      this.router.navigate(['/medico-radiologo/' + this.estudio.medicoRadiologo.token]);

  }

  private marcarEstudiosDeOrdenInterpretados() {
    this.estudiosDeOrden.forEach(estudio => {
      estudio.estado = "INTERPRETADO";
      this.actualizarEstudio(estudio);
    });
  }

  actualizarEstudio(estudio: VentaConceptos) {
    this.ventaConceptosService.editar(estudio).subscribe(std => {
      console.log("Estudio actualizado");
    }, e => {
      console.log("Error al actualizar estudio");
    });
  }

  expandir(multimedia: Multimedia) {
    this.multimediaService.verDocumento(multimedia).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }



private enviarAvisoInterpretacionHechaACorreo(): void  {
  this.mailService.enviarAvisoInterpretacionHecha(this.estudio).subscribe(res =>{
    console.log("Correo enviado");
  },error =>{
    console.log("Ha ocurrido un error al enviar el correo");
  });
}

cargarEstudiosDeOrden(): void {
  this.ventaConceptosService.encontrarPorOrdenVentaId(this.estudio.ordenVenta.id).subscribe(estudios => {
    this.estudiosDeOrden = estudios.filter(estudio => estudio.medicoRadiologo.id === this.estudio.medicoRadiologo.id);
  }, error =>{
    console.log("Ha ocurrido un error al cargar estudios de la órden en cuestión");
  });
}

}
