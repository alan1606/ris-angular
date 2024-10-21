import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { Medico } from 'src/app/models/medico';
import { MedicoService } from 'src/app/services/medico.service';
import { FormularioMedicosComponent } from './formulario-medicos/formulario-medicos.component';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-crud-medicos',
  templateUrl: './crud-medicos.component.html',
  styleUrls: ['./crud-medicos.component.css'],
})
export class CrudMedicosComponent implements OnInit {
  constructor(
    private medicoService: MedicoService,
    private dialog: MatDialog
  ) {}
  public autoCompleteControlMedicoReferente = new UntypedFormControl('');
  public medico: Medico = null;
  public medicosFiltradosRadiologo: Medico[] = [];
  public medicosFiltradosReferente: Medico[] = [];
  public verificado:boolean = true
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  ngOnInit(): void {

    this.autoCompleteControlMedicoReferente.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((valor) => {
          const nombresMedico =
            typeof valor === 'string' ? valor : valor?.nombres;
          return valor
            ? this.medicoService.filtrarReferentesPorNombre(nombresMedico)
            : [];
        }),
        catchError((error) => {
          console.error('Error en la búsqueda de médicos radiólogos:', error);
          return [];
        })
      )
      .subscribe((medicos) => {
        this.medicosFiltradosReferente = medicos;
      });
  }


  cambiarTab(index: number) {
    this.tabGroup.selectedIndex = index;
  }

  mostrarNombreMedico(medico: Medico): string {
    return medico && medico.nombres ? medico.nombres : '';
  }

  seleccionarMedico(event: Medico): void {
    this.medico = event;
    this.cambiarTab(1)
  }

  abrirModalFormularioMedico() {
    const dialogRef = this.dialog.open(FormularioMedicosComponent, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(medico => {
      if(medico){
        this.medico = medico;
      }
    });
  }

  abrirModalFormularioEditarMedico(medico: Medico) {
    const dialogRef = this.dialog.open(FormularioMedicosComponent, {
      width: '1000px',
      data: { medicoDatos:medico},
    });

    dialogRef.afterClosed().subscribe(medico => {
      if(medico){
        this.medico = medico;
      }

    });

  }
  recibirDatosUsuario(event:any){
    console.log(event)
  }
}
