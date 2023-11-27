import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrar-medico-modal',
  templateUrl: './registrar-medico-modal.component.html',
  styleUrls: ['./registrar-medico-modal.component.css']
})
export class RegistrarMedicoModalComponent implements OnInit {
  
  NombreMedico="";
  ApellidosMedico="";
  CedulaMedico="";
  CorreoMedico="";
  WhatsappMedico="";
  DireccionMedico="";
  FechaNacimientoMedico="";
  SexoMedico="";
  constructor() { }

  ngOnInit(): void {
  }

}
