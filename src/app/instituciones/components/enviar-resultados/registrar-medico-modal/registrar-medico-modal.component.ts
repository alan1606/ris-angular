import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { RegistrarPacienteComponent } from 'src/app/recepcion/components/registrar-paciente-modal/registrar-paciente.component';
import { InstitucionService } from 'src/app/services/institucion.service';

@Component({
  selector: 'app-registrar-medico-modal',
  templateUrl: './registrar-medico-modal.component.html',
  styleUrls: ['./registrar-medico-modal.component.css']
})
export class RegistrarMedicoModalComponent implements OnInit {
  
  NombreMedico:string="";
  ApellidosMedico:string="";
  CedulaMedico:string="";
  CorreoMedico:string="";
  WhatsappMedico:any;
  DireccionMedico:string="";
  FechaNacimientoMedico:string="";
  Sexo:string[]=["Masculino","Femenino"];
  constructor(
    public modalRef: MatDialogRef<RegistrarPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private institucionServioce:InstitucionService
  ) { }

  ngOnInit(): void {
    this.data != null? this.datosMedico(): null }

  datosMedico():void{
    this.NombreMedico=this.data.nombres;
    this.ApellidosMedico=this.data.apellidos;
    this.CorreoMedico=this.data.correo;
    this.DireccionMedico=this.data.direccion;
    this.FechaNacimientoMedico=this.data.fechaNacimiento;
    this.Sexo=this.data.sexo;
    this.WhatsappMedico=this.data.whatsapp;
  }

  editarMedico():void{
  // this.institucionServioce.editarMedico(id,medico)
  }

  crearMedico():void{
    // this.institucionServioce.crearMedico(medico)
  }
  cerrar():void{
    this.modalRef.close();
  }

}
