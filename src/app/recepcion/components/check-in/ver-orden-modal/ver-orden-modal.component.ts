import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Paciente } from 'src/app/models/paciente';

@Component({
  selector: 'app-ver-orden-modal',
  templateUrl: './ver-orden-modal.component.html',
  styleUrls: ['./ver-orden-modal.component.css']
})
export class VerOrdenModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
    modelo:OrdenVenta=null;
    paciente:Paciente=null;
  ngOnInit(): void {
    
    if(this.data){
      this.modelo=this.data.orden;
      this.paciente=this.modelo.paciente;

      console.log(this.modelo)
    }
  }
}
