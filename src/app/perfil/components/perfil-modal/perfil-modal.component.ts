import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FechaService } from 'src/app/services/fecha.service';

@Component({
  selector: 'app-perfil-modal',
  templateUrl: './perfil-modal.component.html',
  styleUrls: ['./perfil-modal.component.css']
})
export class PerfilModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fechaService:FechaService){}

  username:string=''
  correo:string='juan@gmail.com'
  whatsapp:string='6271437428'
  direccion:string='Pintores mexicanos #53'
  fechaNacimiento:FormControl= new FormControl()
  sexos:string[]=["1","2"]
  sexo:string="2"
  editarCampos:boolean=true

  ngOnInit(): void {
    this.username=this.data.user
    this.editarCampos=false
    this.fechaNacimiento.setValue(new Date("2003-04-08T00:00:00"))
    this.editarCampos=true

  }

  cambiarEditar(){
    this.editarCampos=!this.editarCampos
  }

  public actualizarFecha(fecha: HTMLInputElement) {
    console.log(fecha.value)
  };

  guardarCambios(){
    console.log(this.sexo)
    console.log(this.fechaNacimiento.value)
  }
}
