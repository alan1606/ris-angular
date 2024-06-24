import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Paciente } from 'src/app/models/paciente';
import { RegistrarPacienteComponent } from '../registrar-paciente-modal/registrar-paciente.component';
import { PacientesService } from 'src/app/services/pacientes.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registrar-paciente-parcial-modal',
  templateUrl: './registrar-paciente-parcial-modal.component.html',
  styleUrls: ['./registrar-paciente-parcial-modal.component.css']
})
export class RegistrarPacienteParcialModalComponent implements OnInit {

  model: Paciente = new Paciente();
  titulo: string = "Crear paciente";
  error: any;

  constructor(
    private service: PacientesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<RegistrarPacienteComponent>,
  ) { }

  ngOnInit(): void {
    if (this.data?.paciente?.id){
      this.model = this.data?.paciente as Paciente;
    } 
  }

  public crear() : void{
    this.model.nombre = this.model.nombre.trim().toUpperCase();
    this.model.apellidoPaterno = this.model.apellidoPaterno.trim().toUpperCase();
    this.model.apellidoMaterno = this.model.apellidoMaterno.trim().toUpperCase();
    this.service.crear(this.model).subscribe(model =>{
      this.model = model;
      Swal.fire('Nuevo:' , `Paciente creado con éxito`, 'success');
      this.modalRef.close(model);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  public editar() : void{
    this.model.nombre = this.model.nombre.trim().toUpperCase();
    this.model.apellidoPaterno = this.model.apellidoPaterno.trim().toUpperCase();
    this.model.apellidoMaterno = this.model.apellidoMaterno.trim().toUpperCase();
    this.service.editar(this.model).subscribe(paciente =>{
      Swal.fire('Modificado: ', `Paciente actualizado con éxito`, "success");
      this.modalRef.close(paciente);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  public cerrar(){
    this.modalRef.close();
  }

}
