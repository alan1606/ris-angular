import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DOWNLOAD_WEASIS_MAC_LINK,
  DOWNLOAD_WEASIS_WINDOWS_LINK,
  VIEWER,
  WEASIS_VIEWER_PATH,
  ZIP_STUDIES_PATH,
  FILES_PATH,
  BASE_ENDPOINT,
} from '../../../config/app';
import { Multimedia } from '../../../models/multimedia';
import { VentaConceptos } from '../../../models/venta-conceptos';
import { AntecedenteEstudioService } from '../../../services/antecedente-estudio.service';
import { InterpretacionService } from '../../../services/interpretacion.service';
import { MultimediaService } from '../../../services/multimedia.service';
import { VentaConceptosService } from '../../../services/venta-conceptos.service';
import { SendMailService } from '../../../services/send-mail.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Interpretacion } from 'src/app/models/interpretacion';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { TokenService } from 'src/app/services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { BuscarMedicoReferenteYCambiarComponent } from '../buscar-medico-referente-ycambiar/buscar-medico-referente-ycambiar.component';
import { Medico } from 'src/app/models/medico';
import { Paciente } from 'src/app/models/paciente';
import { Concepto } from 'src/app/models/concepto';
import { RenderImagenComponent } from 'src/app/shared/components/render-imagen/render-imagen.component';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { VisorInterpretacionComponent } from '../visor-interpretacion/visor-interpretacion.component';
import Swal from 'sweetalert2';
import { ReportService } from '../../services/report.service';
import { Subscription } from 'rxjs';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-dictador',
  templateUrl: './dictador.component.html',
  styleUrls: ['./dictador.component.scss'],
})
export class DictadorComponent implements OnInit, OnDestroy {
  interpretacion: Interpretacion;
  enlacePdf: string = '';
  medicoReferenteRecibido = null;
  estudio: VentaConceptos;
  antecedentes: string = '';
  multimedia: Multimedia[] = [];
  multimediaCargada: Promise<Boolean>;
  paciente: Paciente = new Paciente();
  mostrarSubidaExterna: boolean = true;
  medicoLocal: boolean = false;
  idVentaConcepto: number = null;
  filesPath = FILES_PATH;
  concepto: Concepto = new Concepto();
  templateForm: FormGroup = new FormGroup({
    textEditor: new FormControl(''),
    conclusion: new FormControl(''),
  });
  panelOpenState = false;
  esMobil = window.matchMedia('(min-width:1023px)');
  btnConclusionDisabled: boolean = false;
  private messageSubscription: Subscription;
  private medicoRadiologo: Medico;
  hasUnsavedChanges: boolean = false;
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
    private alertaService: AlertaService,
    private reportService: ReportService,
    private medicoService: MedicoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idVentaConcepto = +params.get('idVentaConcepto');

      if (!this.idVentaConcepto) {
        this.router.navigate(['/']);
      }
    });
    this.ventaConceptosService.ver(this.idVentaConcepto).subscribe(
      (estudio) => {
        const usuario = this.tokenService.getUsername();
        if (!usuario || usuario == '') {
          this.router.navigate(['/']);
        }

        if (estudio.medicoRadiologo.usuario != usuario) {
          this.router.navigate(['/']);
        }

        this.estudio = estudio;
        console.log(estudio.mensaje);
        this.paciente = estudio.paciente;
        this.concepto = estudio.concepto;
        this.cargarAntecedentesInicial();
        this.cargarMultimedia();
        this.medicoLocal = this.estudio.medicoRadiologo.local;
        this.mostrarSubidaExterna = !this.medicoLocal;
        this.medicoRadiologo = this.estudio.medicoRadiologo;

        if (this.estudio.concepto.area.nombre == 'CARDIOLOGIA') {
          this.cargarPlantillaCardio();
        }

        this.cargarInterpretacionAnterior();
        this.reportService.joinTopic(this.estudio.id);
        this.listenerConclusion();
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/']);
      }
    );
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
  }

  cargarMultimedia() {
    this.multimediaService
      .buscarPorOrdenVentaId(this.estudio.ordenVenta.id)
      .subscribe(
        (multimedia) => {
          this.multimedia = multimedia;
          this.multimediaCargada = Promise.resolve(true);
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
    if (
      !this.templateForm.value.conclusion ||
      this.templateForm.value.conclusion === ''
    ) {
      this.alertaService.campoInvalido(
        'Conclusión vacía',
        'porfavor escriba la conclusión'
      );
      return;
    }
    this.interpretacion = new Interpretacion();
    this.enlacePdf = '';

    // this.templateForm.value.textEditor += `<br><b>CONCLUSIÓN</b><p class="ql-align-justify"><strong>${this.eliminarP(this.templateForm.value.conclusion
    //   ).toUpperCase()}</strong></p>`;
    // this.templateForm.get("conclusion").setValue('');

    this.interpretacion.interpretacion =
      this.templateForm.value.textEditor += `<br><b>CONCLUSIÓN</b><p class="ql-align-justify"><strong>${this.eliminarP(
        this.templateForm.value.conclusion
      ).toUpperCase()}</strong></p>`;
    let idsEstudios: number[] = [];
    idsEstudios.push(this.estudio.id);

    this.interpretacion.estudiosIds = idsEstudios;
    this.interpretacionService.crear(this.interpretacion).subscribe(
      (interpretacion) => {
        this.interpretacion = interpretacion;
        this.enlacePdf = `${BASE_ENDPOINT}/ris/interpretaciones/estudio/${this.estudio.id}/pdf`;
        this.cargarInterpretacionAnterior();
        this.templateForm.reset();
      },
      () => {
        console.log('Error creando la interpretación');
      }
    );
    const botonGuardar = document.getElementById('crearPDF');
    const posicionY = botonGuardar?.offsetTop;
    setTimeout(() => {
      window.scroll(0, posicionY + 100);
    }, 200);
  }

  private marcarEstudiosDeOrdenInterpretados() {
    this.estudio.estado = 'INTERPRETADO';
    this.actualizarEstudio(this.estudio);
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

  firmar(): void {
    this.enviarAvisoInterpretacionHechaACorreo();
    this.marcarEstudiosDeOrdenInterpretados();
    this.enviarInformacionSaludParral();
    this.enviarInformacionPensiones();
    this.regresar();
  }

  private cargarInterpretacionAnterior(): void {
    this.interpretacionService.encontrarPorEstudioId(this.estudio.id).subscribe(
      (interpretacionResponse) => {
        const interpretacion: Interpretacion =
          interpretacionResponse.length > 0
            ? interpretacionResponse[0]
            : new Interpretacion();

        let patron = /CONCLUSIÓN/;
        let existeConclusion = patron.test(interpretacion.interpretacion);
        if (existeConclusion) {
          let [firstPart, secondPart] = interpretacion.interpretacion.split(
            '<br><b>CONCLUSIÓN</b><p class="ql-align-justify"><strong>'
          );

          this.templateForm.get('textEditor').setValue(firstPart);
          this.templateForm.get('conclusion').setValue(secondPart || '');
          this.templateForm
            .get('conclusion')
            .setValue(
              this.quitarStrongsFinales(this.templateForm.value.conclusion)
            );
        } else if (this.estudio.concepto.area.nombre == 'CARDIOLOGIA') {
          this.cargarPlantillaCardio();
        } else if (interpretacion.interpretacion) {
          this.templateForm
            .get('textEditor')
            .setValue(interpretacion.interpretacion);
        } else {
          this.templateForm
            .get('textEditor')
            .setValue(interpretacion.interpretacion);
        }
      },
      () => {
        console.log('Error al cargar interpretación anterior');
      }
    );
  }

  private quitarStrongsFinales(html: string): string {
    return html.replace(/(<\/strong>)+$/i, '');
  }

  regresar(): void {
    this.enviarInformacionSaludParral();
    this.router.navigate([
      '/medico-radiologo/' + this.estudio.medicoRadiologo.token,
    ]);
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

  private enviarInformacionPensiones() {
    this.ordenVentaService
      .enviarInformacionPensiones(this.estudio.ordenVenta.id)
      .subscribe(
        () => {
          console.log('Información pensiones enviada');
        },
        () => {
          console.log('Error al enviar información Pensiones');
        }
      );
  }

  abrirFoto(img: Multimedia): void {
    this.dialog.open(RenderImagenComponent, {
      data: img,
      width: '80vw',
      height: '80vh',
    });
  }

  verInterpretacion(): void {
    if (this.mostrarSubidaExterna) {
      this.mostrarSubidaExterna = false;
    }
    this.dialog.open(VisorInterpretacionComponent, {
      data: this.enlacePdf,
      width: '80vw',
      height: '80vh',
    });
  }

  generarConclusion() {
    if (!this.medicoRadiologo.aceptaUsoGeneradorIa) {
      this.mostrarAvisoLegalUsoIa();
      return;
    }

    this.btnConclusionDisabled = true;
    Swal.fire('La conclusión se está generando, espere un momento, por favor');

    const interpretacion = this.templateForm.value.textEditor;
    this.reportService
      .generateReport(interpretacion, this.estudio.id)
      .subscribe(
        () => {
          this.btnConclusionDisabled = false;
        },
        () => {
          Swal.fire(
            'Error',
            'Ocurrió un error al generar la conclusión',
            'error'
          );
          this.btnConclusionDisabled = false;
        }
      );
  }

  private mostrarAvisoLegalUsoIa() {
    Swal.fire({
      html: `
        <h2>Aviso sobre el uso de IA</h2>
        <p>El generador de conclusiones médicas basado en inteligencia artificial que utiliza la API de ChatGPT ha sido diseñado para asistir en la redacción de conclusiones médicas a partir de los hallazgos en los reportes de radiología. Sin embargo, es importante destacar que esta herramienta <strong>no debe ser considerada un sustituto de la revisión y conclusión médica profesional.</strong></p>
        <h3>Responsabilidad del Médico:</h3>
        <ul>
          <li><strong>Revisión Obligatoria:</strong> El texto generado por esta herramienta debe ser revisado cuidadosamente por un médico radiólogo.</li>
          <li><strong>Modificación y Corrección:</strong> Es imperativo que el médico modifique cualquier inexactitud en el texto generado y agregue la información necesaria para asegurar que la conclusión sea precisa y completa.</li>
          <li><strong>Responsabilidad Profesional:</strong> La responsabilidad final por el contenido del informe radiológico recae exclusivamente en el médico que firma el documento. El uso de esta herramienta no exime al médico de su responsabilidad profesional y ética.</li>
        </ul>
        <h3>Limitaciones de la Herramienta:</h3>
        <p>La herramienta está diseñada para asistir en la redacción de conclusiones, pero no puede interpretar imágenes radiológicas ni sustituir el juicio clínico y la experiencia de un profesional médico. Los resultados generados pueden contener errores o imprecisiones y deben ser validados por un médico antes de ser incluidos en el informe final.</p>
        <h3>Consentimiento y Uso:</h3>
        <p>Al utilizar esta herramienta, los médicos aceptan que comprenden sus limitaciones y la necesidad de realizar una revisión exhaustiva del contenido generado. El uso de esta herramienta se realiza bajo el entendimiento de que la responsabilidad final sobre el informe recae en el profesional médico.</p>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'He leído el aviso y acepto los términos',
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.aceptarUsoDeIa();
      }
    });
  }

  private aceptarUsoDeIa() {
    this.medicoService.aceptarUsoDeIa(this.medicoRadiologo).subscribe(
      () => {
        this.medicoRadiologo.aceptaUsoGeneradorIa = true;
        this.generarConclusion();
      },
      () => {
        Swal.fire('Error', 'Ocurrió un error al aceptar el uso de IA', 'error');
      }
    );
  }

  private listenerConclusion() {
    this.messageSubscription = this.reportService.getMessageSubject().subscribe(
      (mensaje: any) => {
        console.log('Listener conclusion: ', mensaje);
        let [firstPart, secondPart] =
          mensaje.conclusion.split('**CONCLUSIÓN:**');
        const conclusion = secondPart ? secondPart : mensaje.conclusion;
        this.templateForm.get('conclusion').setValue(conclusion);
      },
      (error) => {
        console.error({ msg: 'Error obteniendo conclusión', error });
      }
    );
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.reportService.disconect();
  }

  private eliminarP(html: string): string {
    if (html.startsWith('<P>') || html.startsWith('<p>')) {
      html = html.replace(/<p>|<P>/, '');
    }
    if (html.endsWith('</P>') || html.endsWith('</p>')) {
      html = html.replace(/<\/p>|<\/P>$/, '');
    }
    return html;
  }
}
