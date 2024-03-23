import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { flatMap, map } from 'rxjs';
import { IMAGE_PATH } from 'src/app/config/app';
import { Medico } from 'src/app/models/medico';
import { Multimedia } from 'src/app/models/multimedia';
import { Tecnico } from 'src/app/models/tecnico';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AntecedenteEstudioService } from 'src/app/services/antecedente-estudio.service';
import { MedicoService } from 'src/app/services/medico.service';
import { MultimediaService } from 'src/app/services/multimedia.service';
import { TecnicoService } from 'src/app/services/tecnico.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';
import { NuevoMedicoSoloNombreComponent } from '../nuevo-medico-solo-nombre/nuevo-medico-solo-nombre.component';

@Component({
  selector: 'app-enviar-estudio-modal',
  templateUrl: './enviar-estudio-modal.component.html',
  styleUrls: ['./enviar-estudio-modal.component.css']
})
export class EnviarEstudioModalComponent implements OnInit {

  titulo: 'Enviar estudio';

  autocompleteControlMedicoReferente = new UntypedFormControl();
  autocompleteControlMedicoRadiologo = new UntypedFormControl();
  autocompleteControlTecnico = new UntypedFormControl();

  medicosReferentesFiltrados: Medico[] = [];
  medicosRadiologosFiltrados: Medico[] = [];
  tecnicosFiltrados: Tecnico[] = [];

  antecedentesJuntos: string = "";

  estudio: VentaConceptos;
  enviado: VentaConceptos;

  imagePath = IMAGE_PATH;

  private contadorSiPulsado: number = 0;

  private pdf: File;
  private multimedia: Multimedia = new Multimedia();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<EnviarEstudioModalComponent>,
    private antecedenteEstudioService: AntecedenteEstudioService,
    private multimediaService: MultimediaService,
    private tecnicoService: TecnicoService,
    private medicoService: MedicoService,
    private ventaConceptosService: VentaConceptosService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.estudio = this.data.estudio as VentaConceptos;

    this.autocompleteControlMedicoReferente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombres + " " + valor.apellidos),
      flatMap(valor => valor ? this.medicoService.filtrarReferentesPorNombre(valor) : [])
    ).subscribe(referentes => {
      this.medicosReferentesFiltrados = referentes
      console.log(referentes)
    });


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

    }

    this.autocompleteControlMedicoRadiologo.setValue(this.estudio.medicoRadiologo);
    this.autocompleteControlMedicoReferente.setValue(this.estudio.ordenVenta.medicoReferente);
    this.autocompleteControlTecnico.setValue(this.estudio.tecnico);
  }

  cancelar() {
    this.modalRef.close();
  }



  enviar(): void {
    this.enviarAInterpretar();
  }


  private enviarAInterpretar(): void {
    if (this.estudio.ordenVenta.medicoReferente.nombres == "SIN MEDICO REFERENTE") {
      let miText: string= "¿Seguro "
      for(let i=0; i<this.contadorSiPulsado; i++){
        miText += "seguro ";
      }

      miText += "que desea mandar el estudio SIN MÉDICO REFERENTE?";

      Swal.fire({
        title: "SIN MEDICO REFERENTE",
        text: miText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, dejar sin médico referente",
        cancelButtonText: "No, modificar el médico"
      }).then((result) => {
        if(result.isConfirmed){
          this.contadorSiPulsado++;
        }
        if (result.isConfirmed && this.contadorSiPulsado == 3) {
          Swal.fire("Ok", "Está bien, se va a enojar el doc, tú sabes", "warning");
          this.envioBackend();
        }
        if(result.isConfirmed && this.contadorSiPulsado < 3){
          this.enviarAInterpretar();
        }
      });
    }
    else{
      Swal.fire("Enviando", "Se está procesando el envío", "info");
      this.envioBackend();
    }

  }


  private envioBackend() {
    this.ventaConceptosService.enviarAInterpretar(this.estudio).subscribe(
      estudio => {
        this.estudio = estudio;
        this.modalRef.close(this.estudio);
      },
      error => {
        Swal.fire('Error', 'Ha ocurrido un error al enviar el estudio', 'error');
        this.modalRef.close();
        console.log(error);
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

    console.log(referente.validado);
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

  nuevoMedico(){
    const dialogRef = this.dialog.open(NuevoMedicoSoloNombreComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(medico => {
      if(medico){
        this.estudio.ordenVenta.medicoReferente = medico;
        this.autocompleteControlMedicoReferente.setValue(this.estudio.ordenVenta.medicoReferente);
      }
    });
  }
}
