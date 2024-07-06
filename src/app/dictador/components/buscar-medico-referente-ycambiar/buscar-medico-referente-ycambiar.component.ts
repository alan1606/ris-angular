import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { title } from 'process';
import { flatMap, map } from 'rxjs';
import { Medico } from 'src/app/models/medico';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-medico-referente-ycambiar',
  templateUrl: './buscar-medico-referente-ycambiar.component.html',
  styleUrls: ['./buscar-medico-referente-ycambiar.component.css']
})
export class BuscarMedicoReferenteYCambiarComponent implements OnInit {
  @Output() medicoReferenteEnviado = new EventEmitter<any>();


  constructor(
    private medicoService:MedicoService,
    private modalRef:MatDialogRef<BuscarMedicoReferenteYCambiarComponent>,
  ) { }

  estudio=null
  medicoReferente=null
  autocompleteControlMedicoReferente = new UntypedFormControl('',Validators.required);
  medicosReferentesFiltrados: Medico[] = [];
  ngOnInit(): void {
    this.autocompleteControlMedicoReferente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombres + " " + valor.apellidos),
      flatMap(valor => valor ? this.medicoService.filtrarReferentesPorNombre(valor) : [])
    ).subscribe(referentes => this.medicosReferentesFiltrados = referentes);
  }

  mostrarNombreMedicoReferente(medico?: Medico): string {
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
  }

  seleccionarMedicoReferente(event: MatAutocompleteSelectedEvent): void {
    const referente = event.option.value as Medico;
    this.medicoReferente = referente;
    event.option.deselect();
    event.option.focus();
  }

  guardarCambios():void{
    if(!this.medicoReferente){
      Swal.fire( "No seleccionado","Seleccione un medico referente","error"
      )
      return
    }

    this.medicoReferenteEnviado.emit(this.medicoReferente);
    this.modalRef.close();
  }

  cerrar(){
    this.modalRef.close();
  }
}
