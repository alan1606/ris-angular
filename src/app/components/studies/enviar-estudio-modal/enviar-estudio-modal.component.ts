import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { flatMap, map } from 'rxjs';
import { IMAGE_PATH } from 'src/app/config/app';
import { Medico } from 'src/app/models/medico';
import { Tecnico } from 'src/app/models/tecnico';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AntecedenteEstudioService } from 'src/app/services/antecedente-estudio.service';
import { MedicoService } from 'src/app/services/medico.service';
import { TecnicoService } from 'src/app/services/tecnico.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enviar-estudio-modal',
  templateUrl: './enviar-estudio-modal.component.html',
  styleUrls: ['./enviar-estudio-modal.component.css']
})
export class EnviarEstudioModalComponent implements OnInit {

  @ViewChild('medicoRadiologoSelect') medicoRadiologoSelect: MatSelect;


  titulo: 'Enviar estudio';

  autocompleteControlMedicoReferente = new UntypedFormControl();
  autocompleteControlTecnico = new UntypedFormControl();

  medicosReferentesFiltrados: Medico[] = [];
  medicosRadiologosFiltrados: Medico[] = [];
  tecnicosFiltrados: Tecnico[] = [];

  antecedentesJuntos: string = "";

  estudio: VentaConceptos;
  enviado: VentaConceptos;

  imagePath = IMAGE_PATH;

  private contadorSiPulsado: number = 0;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<EnviarEstudioModalComponent>,
    private antecedenteEstudioService: AntecedenteEstudioService,
    private tecnicoService: TecnicoService,
    private medicoService: MedicoService,
    private ventaConceptosService: VentaConceptosService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
) { }

  ngOnInit(): void {
    this.estudio = this.data.estudio as VentaConceptos;

    console.log("estudio", this.estudio)
    this.autocompleteControlTecnico.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombres + " " + valor.apellidos),
      flatMap(valor => valor ? this.tecnicoService.filtrarPorNombre(valor) : [])
    ).subscribe(tecnicos => this.tecnicosFiltrados = tecnicos);

    this.antecedenteEstudioService.filtrarPorVentaConceptosId(this.estudio.id).subscribe(a => a.forEach(antecedente => {
      this.antecedentesJuntos += `${antecedente.antecedente.nombre}, `;
    }));

    if (!this.estudio.mensaje || this.estudio.mensaje === '') {

    }

    this.autocompleteControlMedicoReferente.setValue(this.estudio.ordenVenta.medicoReferente);
    this.autocompleteControlTecnico.setValue(this.estudio.tecnico);
    this.cargarRadiologos();
  }

  private cargarRadiologos() {
    this.medicoService.encontrarRadiologosParaEnvioAInterpretar().subscribe(medicos => {
      this.medicosRadiologosFiltrados = medicos;
      if(this.estudio.medicoRadiologo){
        const selectedMedico = this.medicosRadiologosFiltrados.find(m => m.id === this.estudio.medicoRadiologo.id);
        this.medicoRadiologoSelect.value = selectedMedico;
        this.medicoRadiologoSelect.valueChange.emit(this.estudio.medicoRadiologo);
        this.cdr.detectChanges();
      }
    },
  () =>{
    console.error("Error cargando los médicos radiólogos");
  })
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

  mostrarNombreTecnico(tecnico?: Tecnico): string {
    return tecnico ? `${tecnico.nombres} ${tecnico.apellidos}` : '';
  }

  seleccionarMedicoReferente(event: Medico): void {
    this.estudio.ordenVenta.medicoReferente = event;
  }


  seleccionarMedicoRadiologo(event){
    const medico = event.value as Medico;
    this.estudio.medicoRadiologo = medico;
    console.log(this.estudio.medicoRadiologo);
  }


  seleccionarTecnico(event: MatAutocompleteSelectedEvent): void {
    const tecnico = event.option.value as Tecnico;

    this.estudio.tecnico = tecnico;

    console.log(tecnico);
    event.option.deselect();
    event.option.focus();
  }
}
