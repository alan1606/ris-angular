import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DOWNLOAD_WEASIS_MAC_LINK,
  DOWNLOAD_WEASIS_WINDOWS_LINK,
  VIEWER,
  WEASIS_VIEWER_PATH,
  ZIP_STUDIES_PATH,
  FILES_PATH,
  BASE_ENDPOINT,
} from '../../config/app';
import { Multimedia } from '../../models/multimedia';

import { VentaConceptos } from '../../models/venta-conceptos';
import { AntecedenteEstudioService } from '../../services/antecedente-estudio.service';
import { InterpretacionService } from '../../services/interpretacion.service';
import { MultimediaService } from '../../services/multimedia.service';
import { VentaConceptosService } from '../../services/venta-conceptos.service';
import Swal from 'sweetalert2';

import { SendMailService } from '../../services/send-mail.service';
declare const webkitSpeechRecognition: any;

import { FormControl, FormGroup } from '@angular/forms';

import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { Interpretacion } from 'src/app/models/interpretacion';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { TokenService } from 'src/app/services/token.service';
import { MedicoService } from 'src/app/services/medico.service';
import { MatDialog } from '@angular/material/dialog';
import { BuscarMedicoReferenteYCambiarComponent } from './buscar-medico-referente-ycambiar/buscar-medico-referente-ycambiar.component';
import { CLS_IMGRIGHT } from '@syncfusion/ej2-angular-richtexteditor';
import { Medico } from 'src/app/models/medico';
import { error } from 'console';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-dictador',
  templateUrl: './dictador.component.html',
  styleUrls: ['./dictador.component.scss'],
})
export class DictadorComponent implements OnInit {
  // @Input() setEvent(eventMessage: any) {
  //   this.medicoReferenteRecibido = eventMessage;
  //   console.log(this.medicoReferenteRecibido)
  // }
  interpretacion: Interpretacion;
  enlacePdf: string = '';
  medicoReferenteRecibido = null;
  estudio: VentaConceptos;
  antecedentes: string = '';
  multimedia: Multimedia[] = [];
  multimediaCargada: Promise<Boolean>;
  estudiosDeOrden: VentaConceptos[];

  mostrarSubidaExterna: boolean = true;
  medicoLocal: boolean = false;

  filesPath = FILES_PATH;

  templateForm: FormGroup;

  quillEditorModules = {};

  constructor(
    private route: ActivatedRoute,
    private ventaConceptosService: VentaConceptosService,
    private antecedenteEstudioService: AntecedenteEstudioService,
    private router: Router,
    private dialog: MatDialog,
    private interpretacionService: InterpretacionService,
    private multimediaService: MultimediaService,
    private mailService: SendMailService,
    private ordenVentaService: OrdenVentaService,
    private tokenService: TokenService,
    private medicoService: MedicoService
  ) {
    this.templateForm = new FormGroup({
      textEditor: new FormControl(''),
    });

    this.quillEditorModules = {
      blotFormatter: {},
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idVentaConcepto: number = +params.get('idVentaConcepto');

      if (!idVentaConcepto) {
        this.router.navigate(['/']);
      }
      this.ventaConceptosService.ver(idVentaConcepto).subscribe(
        (estudio) => {
          console.log({
            'El médico asignado al estudio es: ':
              estudio.medicoRadiologo.usuario,
          });
          const usuario = this.tokenService.getUsername();
          if (!usuario || usuario == '') {
            this.router.navigate(['/']);
          }

          if (estudio.medicoRadiologo.usuario != usuario) {
            this.router.navigate(['/']);
          }

          this.estudio = estudio;
          this.cargarAntecedentesInicial();
          this.cargarMultimedia();
          this.cargarEstudiosDeOrden();
          this.medicoLocal = this.estudio.medicoRadiologo.local;
          this.mostrarSubidaExterna = !this.medicoLocal;

          if (this.estudio.concepto.area.nombre == 'CARDIOLOGIA') {
            this.cargarPlantillaCardio();
          }

          this.cargarInterpretacionAnterior();
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/']);
        }
      );
    });
  }

  abrirMedicoReferenteYCambiar() {
    const dialogRef = this.dialog.open(BuscarMedicoReferenteYCambiarComponent, {
      width: '1000px',
    });
    dialogRef.componentInstance.medicoReferenteEnviado.subscribe(
      (mensaje: Medico) => {
        if (!mensaje) {
          return;
        }
        this.medicoReferenteRecibido = mensaje;
        this.recibirMensaje(mensaje);
        // console.log(this.medicoReferenteRecibido);
      }
    );
  }

  recibirMensaje(medico: Medico) {
    this.estudio.ordenVenta.medicoReferente = medico;
    // console.log(this.estudio.ordenVenta);
    this.ordenVentaService
      .actualizarOrdenVenta(this.estudio.ordenVenta)
      .subscribe(
        (orden) => {
          console.log(orden);
        },
        (error) => console.log(error)
      );
  }

  cargarPlantillaCardio(): void {
    this.templateForm.get('textEditor').setValue(
      `<strong>Antecedentes:</strong> ${this.antecedentes}
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
    `
    );

    console.log(this.templateForm.value.textEditor);
  }

  cargarMultimedia() {
    this.multimediaService
      .buscarPorOrdenVentaId(this.estudio.ordenVenta.id)
      .subscribe(
        (multimedia) => {
          this.multimedia = multimedia;
          this.multimediaCargada = Promise.resolve(true);
          console.log(multimedia);
        },
        (error) => {
          console.log('Error al cargar multimedia');
          Promise.resolve(false);
        }
      );
  }

  cargarAntecedentesInicial() {
    this.antecedenteEstudioService
      .filtrarPorVentaConceptosId(this.estudio.id)
      .subscribe((a) =>
        a.forEach(
          (antecedente) => {
            this.antecedentes += `${antecedente.antecedente.nombre} \n`;
            console.log('Cargando antecedentes iniciales');
          },
          (error) => {
            console.log('Error al cargar antecedentes iniciales');
          }
        )
      );
  }

  ver(estudio: VentaConceptos): void {
    window.open(`${VIEWER}${estudio.iuid}`);
  }

  descargarZip(estudio: VentaConceptos): void {
    window.open(
      `${ZIP_STUDIES_PATH}/${estudio.iuid}/?accept=application/zip;transfer-syntax=*`
    );
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
    this.interpretacion = new Interpretacion();
    this.enlacePdf = '';
    this.interpretacion.estudio = this.estudio;
    this.interpretacion.interpretacion = this.templateForm.value.textEditor;

    this.interpretacionService.crear(this.interpretacion).subscribe(
      (interpretacion) => {
        this.interpretacion = interpretacion;
        this.enlacePdf = `${BASE_ENDPOINT}/ris/interpretaciones/estudio/${this.estudio.id}/pdf`;
      },
      () => {
        console.log('Error creando la interpretación');
      }
    );
  }

  private marcarEstudiosDeOrdenInterpretados() {
    this.estudiosDeOrden.forEach((estudio) => {
      estudio.estado = 'INTERPRETADO';
      this.actualizarEstudio(estudio);
    });
  }

  actualizarEstudio(estudio: VentaConceptos) {
    this.ventaConceptosService.editar(estudio).subscribe(
      (std) => {
        console.log('Estudio actualizado');
      },
      (e) => {
        console.log('Error al actualizar estudio');
      }
    );
  }

  expandir(multimedia: Multimedia) {
    this.multimediaService.verDocumento(multimedia).subscribe((res) => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  private enviarAvisoInterpretacionHechaACorreo(): void {
    this.mailService.enviarAvisoInterpretacionHecha(this.estudio).subscribe(
      (res) => {
        console.log('Correo enviado');
      },
      (error) => {
        console.log('Ha ocurrido un error al enviar el correo');
      }
    );
  }

  cargarEstudiosDeOrden(): void {
    this.ventaConceptosService
      .encontrarPorOrdenVentaId(this.estudio.ordenVenta.id)
      .subscribe(
        (estudios) => {
          this.estudiosDeOrden = estudios.filter(
            (estudio) =>
              estudio.medicoRadiologo.id === this.estudio.medicoRadiologo.id
          );
        },
        (error) => {
          console.log(
            'Ha ocurrido un error al cargar estudios de la órden en cuestión'
          );
        }
      );
  }

  firmar(): void {
    this.enviarAvisoInterpretacionHechaACorreo();

    this.marcarEstudiosDeOrdenInterpretados();

    this.enviarInformacionSaludParral();

    this.regresar();
  }

  private cargarInterpretacionAnterior(): void {
    this.interpretacionService.encontrarPorEstudioId(this.estudio.id).subscribe(
      (interpretacionResponse) => {
        const interpretacion: Interpretacion =
          interpretacionResponse.length > 0
            ? interpretacionResponse[0]
            : new Interpretacion();
        this.templateForm
          .get('textEditor')
          .setValue(interpretacion?.interpretacion);
      },
      () => {
        console.log('Error al cargar interpretación anterior');
      }
    );
  }

  /*descargarPdf(): void{
    window.open(`${BASE_ENDPOINT}/ris/interpretaciones/estudio/${this.estudio.id}/pdf`);
  }*/

  regresar(): void {
    this.enviarInformacionSaludParral();
    this.router.navigate([
      '/medico-radiologo/' + this.estudio.medicoRadiologo.token,
    ]);
  }

  formatearConclusion(): void {
    let interpretacionHtml = this.templateForm.value.textEditor;

    const regex = /conclusi[oóÓn]/i;

    let ultimoIndice = -1;
    let desplazamiento = 0;
    let indice;

    while (
      (indice = interpretacionHtml.slice(desplazamiento).search(regex)) !== -1
    ) {
      ultimoIndice = indice + desplazamiento;
      desplazamiento += indice + 1;
    }

    if (ultimoIndice == -1) {
      console.log('No se encontraron coincidencias');
      return;
    }

    let textoAnterior: string = interpretacionHtml.substring(0, ultimoIndice);
    let textoPosterior: string = interpretacionHtml.substring(ultimoIndice);

    textoPosterior = textoPosterior.toUpperCase();

    textoAnterior += '<strong>';
    textoPosterior += '</strong>';

    let interpretacionFinal: string = textoAnterior + textoPosterior;

    interpretacionFinal = interpretacionFinal.replace(/&nbsp;/gi, ' ');

    this.templateForm.get('textEditor').setValue(interpretacionFinal);
  }

  private enviarInformacionSaludParral() {
    this.ordenVentaService
      .enviarInformacionSaludParral(this.estudio.ordenVenta.id)
      .subscribe(
        () => {
          console.log('Información salud Parral enviada');
        },
        () => {
          console.log('Error al enviar informaición salud Parral');
        }
      );
  }
}
