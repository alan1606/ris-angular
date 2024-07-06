import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-generar-citas-modal',
  templateUrl: './generar-citas-modal.component.html',
  styleUrls: ['./generar-citas-modal.component.css']
})
export class GenerarCitasModalComponent implements OnInit {

  fecha: fechas = {fechaInicio: '',fechaFin:''};
  

  constructor( public dialogRef: MatDialogRef<GenerarCitasModalComponent>) { 
  }

  ngOnInit(): void {
  }

}

interface fechas{
  fechaInicio:string,
  fechaFin:string
}