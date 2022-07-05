import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, toHTML, Toolbar, Validators, toDoc } from 'ngx-editor';
import { DOWNLOAD_WEASIS_MAC_LINK, DOWNLOAD_WEASIS_WINDOWS_LINK, VIEWER, WEASIS_VIEWER_PATH, ZIP_STUDIES_PATH, FILES_PATH } from '../../config/app';
import { Concepto } from '../../models/concepto';
import { Interpretacion } from '../../models/interpretacion';
import { Multimedia } from '../../models/multimedia';
import { OrdenVenta } from '../../models/orden-venta';
import { Paciente } from '../../models/paciente';
import { VentaConceptos } from '../../models/venta-conceptos';
import { AntecedenteEstudioService } from '../../services/antecedente-estudio.service';
import { InterpretacionService } from '../../services/interpretacion.service';
import { MultimediaService } from '../../services/multimedia.service';
import { VentaConceptosService } from '../../services/venta-conceptos.service';
import Swal from 'sweetalert2';
import initJsonDoc from './doc';
import { Dictado } from './dictado';
import { SendMailService } from '../../services/send-mail.service';
declare const webkitSpeechRecognition: any;

@Component({
  selector: 'app-dictador',
  templateUrl: './dictador.component.html',
  styleUrls: ['./dictador.component.scss']
})


export class DictadorComponent implements OnInit, OnDestroy {

  ingresarAperturaMayus = true;
  speechRecognition: any;
  interpretacion: Interpretacion = new Interpretacion();
  estudio: VentaConceptos;
  antecedentes: string = '';
  editor: Editor;
  html;
  multimedia: Multimedia[] = [];
  multimediaCargada: Promise<Boolean>;
  estudiosDeOrden: VentaConceptos[]

  filesPath = FILES_PATH;

  dictado = new Dictado();

  isDictando = false;
  isApiSoportada = "webkitSpeechRecognition" in window;

  form = new FormGroup({
    editorContent: new FormControl(
      { value: initJsonDoc, disabled: false }
    ),
  });

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h6', 'h5'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private route: ActivatedRoute,
    private ventaConceptosService: VentaConceptosService,
    private antecedenteEstudioService: AntecedenteEstudioService,
    private router: Router,
    private interpretacionService: InterpretacionService,
    private multimediaService: MultimediaService,
    private mailService: SendMailService) {
    this.inicializarEstudioVacio();
  }

  ngOnInit(): void {
    this.editor = new Editor();

    this.route.paramMap.subscribe(params => {
      const idVentaConcepto: number = + params.get('idVentaConcepto');
      if (idVentaConcepto) {
        this.ventaConceptosService.ver(idVentaConcepto).subscribe(estudio => {
          this.estudio = estudio;
          this.interpretacion.estudio = this.estudio;
          this.cargarAntecedentesInicial();
          this.cargarInterpretacionAnterior();
          this.cargarMultimedia();
          this.cargarEstudiosDeOrden();
          console.log(estudio);
        }, error => {
          this.router.navigate(['/']);
        });
      }
    });

    this.inicialzarDictador();
  }

  cargarPlantillaCardio(): void {
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
    this.form.get('editorContent').setValue(jsonDoc);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get doc(): AbstractControl {
    return this.form.get('editorContent');
  }

  inicialzarDictador() {
    if (!this.isApiSoportada) {
      console.log("Api no soportada");
      return;
    }

    this.speechRecognition = new webkitSpeechRecognition();

    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.lang = 'es-MX';

    this.logicaResultado();
    this.logicaFin();

  }

  inicializarEstudioVacio() {
    this.estudio = new VentaConceptos();
    this.estudio.paciente = new Paciente();
    this.estudio.ordenVenta = new OrdenVenta();
    this.estudio.concepto = new Concepto();
  }


  dictar() {
    if (this.isApiSoportada) {
      this.isDictando = true;
      this.speechRecognition.start();
      this.html = toHTML(this.doc.value);
    }
  }

  parar() {
    if (this.isApiSoportada) {
      this.speechRecognition.stop();
    }
  }

  logicaFin() {
    this.speechRecognition.addEventListener('end', (e: any) => {
      this.hacerReemplazos();
      this.actualizarEditor();
      this.isDictando = false;
      this.dictado.final = "";
      console.log("Fin");
    });
  }


  logicaResultado() {
    this.speechRecognition.addEventListener('result', (e: any) => {
      this.dictado.parcial = "";
      this.dictado.final = "";
      this.isDictando = true;

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          this.dictado.final = e.results[i][0].transcript;
        } else {
          this.dictado.parcial = e.results[i][0].transcript;
          console.log(this.dictado.parcial);
        }
      }

    });
  }

  hacerReemplazos() {
    this.dictado.final = this.dictado.final.replace(/ iniciar conclusión/g, '<br></br><br></br><b>CONCLUSIÓN<br></br>');
    this.dictado.final = this.dictado.final.replace(/ finalizar conclusión/g, '.</b>');
    this.dictado.final = this.dictado.final.replace(/ punto y coma/g, ';');
    this.dictado.final = this.dictado.final.replace(/ punto y aparte/g, '.<br></br><br><br/>');
    this.dictado.final = this.dictado.final.replace(/ punto y seguido/g, '.');
    this.dictado.final = this.dictado.final.replace(/ punto/g, '.');
    this.dictado.final = this.dictado.final.replace(/ coma/g, ',');
    this.dictado.final = this.dictado.final.replace(/ nueva línea/g, '<br></br>');

    this.dictado.final = this.dictado.final.replace(/iniciar conclusión/g, '<br></br><br></br><b>CONCLUSIÓN<br></br>');
    this.dictado.final = this.dictado.final.replace(/finalizar conclusión/g, '.</b>');
    this.dictado.final = this.dictado.final.replace(/punto y coma/g, ';');
    this.dictado.final = this.dictado.final.replace(/punto y aparte/g, '.<br></br><br><br/>');
    this.dictado.final = this.dictado.final.replace(/punto y seguido/g, '.');
    this.dictado.final = this.dictado.final.replace(/punto/g, '.');
    this.dictado.final = this.dictado.final.replace(/coma/g, ',');
    this.dictado.final = this.dictado.final.replace(/nueva línea/g, '<br></br>');

    this.dictado.final = this.dictado.final.replace(/<br>/g, '<br></br>');
    this.dictado.final = this.dictado.final.replace(/\u00a0/g, " ");
    this.dictado.final = this.dictado.final.replace(/\xA0/g, ' ');
  }


  actualizarEditor() {
    console.log(this.dictado.final);
    const jsonDoc = (toDoc(`${this.html}${this.dictado.final}`));
    this.form.get('editorContent').setValue(jsonDoc);
  }


  cargarInterpretacionAnterior() {
    this.interpretacionService.encontrarPorEstudioId(this.estudio.id).subscribe(interpretacion => {
      if (interpretacion.length > 0) {
        this.interpretacion = interpretacion[0];
        const jsonDoc = (toDoc(interpretacion[0].interpretacion));
        this.form.get('editorContent').setValue(jsonDoc);
      }
      else {
        this.cargarAntecedentes();
      }
    });

  }

  cargarMultimedia() {
    this.multimediaService.buscarPorOrdenVentaId(this.estudio.ordenVenta.id).subscribe(multimedia => {
      this.multimedia = multimedia;
      this.multimediaCargada = Promise.resolve(true);
      console.log(multimedia);
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
    }));
  }

  cargarAntecedentesInicial() {
    this.antecedenteEstudioService.filtrarPorVentaConceptosId(this.estudio.id).subscribe(a => a.forEach(antecedente => {
      this.antecedentes += `${antecedente.antecedente.nombre} \n`;
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
    let interpretacionHtml = toHTML(this.doc.value);

    interpretacionHtml = interpretacionHtml.replace(/\u00a0/g, " ");
    interpretacionHtml = interpretacionHtml.replace(/\xA0/g, ' ');
    interpretacionHtml = interpretacionHtml.replace(/\<p\>\<\/p\>/g, "<br></br>");

    console.log(interpretacionHtml);


    this.interpretacion.interpretacion = interpretacionHtml;
    this.interpretacionService.crear(this.interpretacion).subscribe(interpretacion => {
      this.interpretacion = interpretacion;
      console.log(this.interpretacion);
      Swal.fire("Finalizado", "El reporte ha sido creado", "success");

      this.enviarAvisoInterpretacionHechaACorreo();

      this.marcarEstudiosDeOrdenInterpretados();

      this.router.navigate(['/medico-radiologo/' + this.estudio.medicoRadiologo.token]);
    }, error => {
      Swal.fire("Error", "Ha ocurrido un error al guardar el reporte", "error");
    });
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

  mayus(): void {
    const interpretacionHtml = toHTML(this.doc.value);
    console.log(interpretacionHtml);
    if (this.ingresarAperturaMayus) {
      this.editor.commands
        .insertText('MAYUS#')
        .focus()
        .scrollIntoView()
        .exec();
    }
    else {
      this.editor.commands
        .insertText('#MAYUS')
        .focus()
        .scrollIntoView()
        .exec();

        this.reemplazarMayus();
    }
    this.ingresarAperturaMayus = !this.ingresarAperturaMayus;
  }


reemplazarMayus(): void {
  let interpretacionHtml = toHTML(this.doc.value);
  interpretacionHtml = interpretacionHtml.replace(/&nbsp;/g, " ");


  const inicio = interpretacionHtml.indexOf("MAYUS#");
  const fin = interpretacionHtml.indexOf("#MAYUS");

  const izquierda = interpretacionHtml.substring(0, inicio + "MAYUS#".length);
  let substring = interpretacionHtml.substring(inicio + "MAYUS#".length, fin);
  const derecha = interpretacionHtml.substring(fin, interpretacionHtml.length);

  substring = substring.toUpperCase();

  interpretacionHtml = izquierda + substring + derecha;
  interpretacionHtml = interpretacionHtml.replace(/MAYUS#/g, '');
  interpretacionHtml = interpretacionHtml.replace(/#MAYUS/g, '');

  console.log(substring);
  const jsonDoc = (toDoc(interpretacionHtml));
  this.form.get('editorContent').setValue(jsonDoc);

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