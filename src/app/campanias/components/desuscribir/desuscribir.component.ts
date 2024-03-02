import { Component } from '@angular/core';
import { Persona } from '../../models/persona';
import Swal from 'sweetalert2';
import { CampaniaService } from '../../services/campania.service';

@Component({
  selector: 'app-desuscribir',
  templateUrl: './desuscribir.component.html',
  styleUrls: ['./desuscribir.component.css']
})
export class DesuscribirComponent {
  persona: Persona = {
    nombre: '',
    email: '',
    whatsapp: '',
    suscripcion: true
  }

  constructor(
    private service: CampaniaService
  ) { }

  desuscribir() {
    if (!this.datosValidos()) {
      return;
    }
    this.service.desuscribir(this.persona).subscribe(
      () => {

      },
      () =>{
        
      }
    );
  }

  private datosValidos(): boolean {
    if (!this.persona.nombre) {
      Swal.fire("Error", "Ingrese su nombre", "error");
      return false;
    }
    if (!this.persona.email) {
      Swal.fire("Error", "Ingrese su correo", "error");
      return false;
    }
    if (!this.persona.whatsapp) {
      Swal.fire("Error", "Ingrese su número de whatsapp", "error");
      return false;
    }
    if (this.invalidoWhatsapp()) {
      Swal.fire("Error", "Ingrese correctamente su número de whatsapp", "error");
      return false;
    }
    if (this.invalidoCorreo()) {
      Swal.fire("Error", "Ingrese correctamente su correo", "error");
      return false;
    }
    return true;
  }

  private invalidoWhatsapp(): boolean {
    if (this.persona.whatsapp.length < 10) {
      return true;
    }
    if (this.persona.whatsapp.match(/[a-zA-Z]/)) {
      return true;
    }
    return false;
  }

  private invalidoCorreo(): boolean {
    const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,4}$/;

    if (this.persona.email.match(regexEmail)) {
      return false;
    }
    return true;
  }

  private limpiar(): void {
    this.persona.nombre = "";
    this.persona.email = "";
    this.persona.suscripcion = true;
    this.persona.whatsapp = "";
  }
}
