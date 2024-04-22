import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Medico } from 'src/app/models/medico';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { NuevoMedicoSoloNombreComponent } from '../studies/nuevo-medico-solo-nombre/nuevo-medico-solo-nombre.component';
import { flatMap, map } from 'rxjs';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-buscador-medicos-referentes',
  templateUrl: './buscador-medicos-referentes.component.html',
  styleUrls: ['./buscador-medicos-referentes.component.css'],
})
export class BuscadorMedicosReferentesComponent implements OnInit {
  
  @Output() medicoEnviado = new EventEmitter<Medico>();
  constructor(
    private dialog: MatDialog,
    private medicoService: MedicoService
  ) {}
  autocompleteControlMedicoReferente = new UntypedFormControl();
  medicosReferentesFiltrados: Medico[] = [];
  estudio: VentaConceptos;

  ngOnInit(): void {
    this.autocompleteControlMedicoReferente.valueChanges
      .pipe(
        map((valor) =>
          typeof valor === 'string'
            ? valor
            : valor.nombres + ' ' + valor.apellidos
        ),
        flatMap((valor) =>
          valor ? this.medicoService.filtrarReferentesPorNombre(valor) : []
        )
      )
      .subscribe((referentes) => {
        this.medicosReferentesFiltrados = referentes;
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
      data: {},
    });

    dialogRef.afterClosed().subscribe((medico) => {
      if (medico) {
        this.estudio.ordenVenta.medicoReferente = medico;
        this.autocompleteControlMedicoReferente.setValue(
          this.estudio.ordenVenta.medicoReferente
        );
      }
    });
  }
}
