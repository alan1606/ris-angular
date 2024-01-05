import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medico } from 'src/app/models/medico';

@Component({
  selector: 'app-formulario-medicos',
  templateUrl: './formulario-medicos.component.html',
  styleUrls: ['./formulario-medicos.component.css'],
})
export class FormularioMedicosComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  modelo=null;
  medico: Medico = null;
  ngOnInit(): void {
    if (this.data) {
      this.medico = this.data.medico;
    }
  }
}
