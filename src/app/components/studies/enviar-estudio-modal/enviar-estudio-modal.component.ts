import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { flatMap, map } from 'rxjs';
import { IMAGE_PATH } from 'src/app/config/app';
import { Medico } from 'src/app/models/medico';
import { Multimedia } from 'src/app/models/multimedia';
import { Tecnico } from 'src/app/models/tecnico';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AntecedenteEstudioService } from 'src/app/services/antecedente-estudio.service';
import { MedicoService } from 'src/app/services/medico.service';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { SendMailService } from 'src/app/services/send-mail.service';
import { TecnicoService } from 'src/app/services/tecnico.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enviar-estudio-modal',
  templateUrl: './enviar-estudio-modal.component.html',
  styleUrls: ['./enviar-estudio-modal.component.css']
})
export class EnviarEstudioModalComponent implements OnInit {

  autocompleteControlMedicoReferente = new FormControl();
  autocompleteControlMedicoRadiologo = new FormControl();
  autocompleteControlTecnico = new FormControl();

  medicosReferentesFiltrados: Medico[] = [];
  medicosRadiologosFiltrados: Medico[] = [];
  tecnicosFiltrados: Tecnico[] = [];

  antecedentesJuntos: string = "";
  estudio: VentaConceptos;
  enviado: VentaConceptos;
  titulo: 'Enviar estudio';
  imagePath = IMAGE_PATH;
s
  private pdf: File;
  private multimedia: Multimedia = new Multimedia();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<EnviarEstudioModalComponent>,
    private antecedenteEstudioService: AntecedenteEstudioService,
    private multimediaService: MultimediaService,
    private tecnicoService: TecnicoService,
    private medicoService: MedicoService,
    private sendMailService: SendMailService,
    private ventaConceptosService: VentaConceptosService,
    private ordenVentaService: OrdenVentaService,
    private pacienteService: PacientesService) { }

  ngOnInit(): void {
    this.estudio = this.data.estudio as VentaConceptos;

    this.autocompleteControlMedicoReferente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombres + " " + valor.apellidos),
      flatMap(valor => valor ? this.medicoService.filtrarReferentesPorNombre(valor) : [])
    ).subscribe(referentes => this.medicosReferentesFiltrados = referentes);


    this.autocompleteControlMedicoRadiologo.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombres + " " + valor.apellidos),
      flatMap(valor => valor ? this.medicoService.filtrarRadiologosPorNombre(valor) : [])
    ).subscribe(radiologos => this.medicosRadiologosFiltrados = radiologos);


    this.autocompleteControlTecnico.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombres + " " + valor.apellidos),
      flatMap(valor => valor ? this.tecnicoService.filtrarPorNombre(valor) : [])
    ).subscribe(tecnicos => this.tecnicosFiltrados = tecnicos);

    this.antecedenteEstudioService.filtrarPorVentaConceptosId(this.estudio.id).subscribe(a => a.forEach(antecedente => {
      this.antecedentesJuntos += `${antecedente.antecedente.nombre}, `;
      console.log(antecedente.antecedente.nombre);
    }));

    if (!this.estudio.mensaje || this.estudio.mensaje === '') {
      this.estudio.mensaje = `DiagnoCons ha enviado un estudio de ${this.estudio.concepto.concepto} del paciente ${this.estudio.paciente.nombreCompleto} `;
    }

    this.autocompleteControlMedicoRadiologo.setValue(this.estudio.medicoRadiologo);
    this.autocompleteControlMedicoReferente.setValue(this.estudio.ordenVenta.medicoReferente);
    this.autocompleteControlTecnico.setValue(this.estudio.tecnico);
  }

  cancelar() {
    this.modalRef.close();
  }


  enviar(estudio: VentaConceptos): void {
    this.actualizarEstudio();
    this.actualizarOrdenVenta();
    this.actualizarPaciente();

    this.enviarCorreo();
    
    this.modalRef.close();

  }

  enviarCorreo() {
    this.sendMailService.enviarCorreo(this.estudio).subscribe(result =>
      Swal.fire('Enviado', 'El correo ha sido enviado', 'success'),
      e =>
        Swal.fire('Error', 'Ha ocurrido un error al enviar el correo', 'error')
    );
  }

  actualizarPaciente() {
    this.pacienteService.editar(this.estudio.paciente).subscribe(paciente => console.log(paciente),
      e => console.log("error")
    );
  }

  actualizarOrdenVenta(): void {
    this.ordenVentaService.actualizarOrdenVenta(this.estudio.ordenVenta).subscribe(orden => console.log(orden));
  }


  actualizarEstudio() {
    this.ventaConceptosService.editar(this.estudio).subscribe(estudio => console.log(estudio),
      e => {
        console.log("Error al actualizar estudio");
      }
    );
  }

  seleccionarPdf(event): void {
    this.pdf = event.target.files[0];
    console.info(this.pdf);
    if (this.pdf.type.indexOf('pdf') < 0) {
      Swal.fire('Error', 'Solamente puede seleccionar un archivo pdf', 'error');
    }
    else {
      this.multimedia.ordenVenta = this.estudio.ordenVenta;

      this.multimediaService.subirPdf(this.multimedia, this.pdf).subscribe(multimedia =>
        Swal.fire('Subido', 'PDF subido exitosamente', 'success'),
        e =>
          Swal.fire('Error', 'No se pudo subir el PDF', 'error'),
      );
    }
  }

  mostrarNombreMedicoReferente(medico?: Medico): string {
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
  }

  mostrarNombreMedicoRadiologo(medico?: Medico): string {
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
  }

  mostrarNombreTecnico(tecnico?: Tecnico): string {
    return tecnico ? `${tecnico.nombres} ${tecnico.apellidos}` : '';
  }

  seleccionarMedicoReferente(event: MatAutocompleteSelectedEvent): void {
    const referente = event.option.value as Medico;

    this.estudio.ordenVenta.medicoReferente = referente;

    console.log(referente);
    event.option.deselect();
    event.option.focus();
  }

  seleccionarMedicoRadiologo(event: MatAutocompleteSelectedEvent): void {
    const radiologo = event.option.value as Medico;

    this.estudio.medicoRadiologo = radiologo;

    console.log(radiologo);
    event.option.deselect();
    event.option.focus();
  }

  seleccionarTecnico(event: MatAutocompleteSelectedEvent): void {
    const tecnico = event.option.value as Tecnico;

    this.estudio.tecnico = tecnico;

    console.log(tecnico);
    event.option.deselect();
    event.option.focus();
  }
}
