import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegistrarPacienteComponent } from '../../registrar-paciente-modal/registrar-paciente.component';
import { RegistrarPacienteParcialModalComponent } from '../../registrar-paciente-parcial-modal/registrar-paciente-parcial-modal.component';
import { Paciente } from 'src/app/models/paciente';
@Component({
  selector: 'app-paciente-ordenes',
  templateUrl: './paciente-ordenes.component.html',
  styleUrls: ['./paciente-ordenes.component.css']
})
export class PacienteOrdenesComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
  public modalRef: MatDialogRef<PacienteOrdenesComponent>
  
  ) { }

  model:Paciente=null;

  ngOnInit(): void {
    if(this.data?.paciente?.id){
      this.model=this.data?.paciente as Paciente
    }
    console.log(this.model)
  }

  verOrden(id):void{
    console.log(id)
  }
}
