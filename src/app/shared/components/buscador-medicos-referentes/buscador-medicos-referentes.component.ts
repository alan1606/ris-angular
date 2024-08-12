import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Medico } from 'src/app/models/medico';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { forkJoin, map, mergeMap, of } from 'rxjs';
import { MedicoService } from 'src/app/services/medico.service';
import { NuevoMedicoSoloNombreComponent } from 'src/app/components/studies/nuevo-medico-solo-nombre/nuevo-medico-solo-nombre.component';

@Component({
  selector: 'app-buscador-medicos-referentes',
  templateUrl: './buscador-medicos-referentes.component.html',
  styleUrls: ['./buscador-medicos-referentes.component.css'],
})
export class BuscadorMedicosReferentesComponent implements OnInit {
  @Output() medicoEnviado = new EventEmitter<Medico>();
  @Input() mostrarNuevoMedicoInput?: boolean = true;
  @Input() medicoExiste?: Medico = null;
  @Input() esAdmin: boolean = false;
  @Input() public etiqueta: string = 'Medico Referente';
  constructor(
    private dialog: MatDialog,
    private medicoService: MedicoService
  ) {}
  mostrarNuevoMedico: boolean = true;
  autocompleteControlMedicoReferente = new UntypedFormControl();
  medicosReferentesFiltrados: Medico[] = [];
  estudio: VentaConceptos = new VentaConceptos();

  ngOnInit(): void {
    this.mostrarNuevoMedico = this.mostrarNuevoMedicoInput;
    if (this.medicoExiste) {
      this.autocompleteControlMedicoReferente.setValue(this.medicoExiste);
      this.medicoEnviado.emit(this.medicoExiste);
    }

    this.autocompleteControlMedicoReferente.valueChanges
      .pipe(
        map((valor) =>
          typeof valor === 'string'
            ? valor
            : valor.nombres + ' ' + valor.apellidos
        ),
        mergeMap((valor) => {
          if (valor) {
            return forkJoin([
              this.medicoService.filtrarReferentesPorNombre(valor),
              this.medicoService.filtrarRadiologosPorNombre(valor),
            ]);
          } else {
            return of([[], []]);
          }
        })
      )
      .subscribe((resultados: any[]) => {
        const referentes = resultados[0];
        const radiologos = resultados[1];
        if (this.esAdmin) {
          this.medicosReferentesFiltrados = radiologos;
        }
        if (!this.esAdmin) {
          this.medicosReferentesFiltrados = referentes;
        }
      });
  }

  seleccionarMedicoReferente(event: MatAutocompleteSelectedEvent): void {
    const referente = event.option.value as Medico;
    this.medicoEnviado.emit(referente);
  }

  mostrarNombreMedicoReferente(medico?: Medico): string {
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
  }

  nuevoMedico() {
    const dialogRef = this.dialog.open(NuevoMedicoSoloNombreComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((medico) => {
      if (medico) {
        this.autocompleteControlMedicoReferente.setValue(
          medico
        );
        this.medicoEnviado.emit(medico);
      }
    });
  }

  editarMedico() {
    const dialogRef = this.dialog.open(NuevoMedicoSoloNombreComponent, {
      data: this.medicoExiste,
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((medico) => {
      if (medico) {
        this.autocompleteControlMedicoReferente.setValue(
          medico
        );
        this.medicoEnviado.emit(medico);
      }
    });
  }
}
