import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-medico-referende',
  templateUrl: './registro-medico-referende.component.html',
  styleUrls: ['./registro-medico-referende.component.css'],
})
export class RegistroMedicoReferendeComponent {
  whatsapp: FormControl = new FormControl(null);
  correo: FormControl = new FormControl(null, [Validators.email]);
  codigoEnviado: boolean = false;
  codigoVerficiacion: FormControl = new FormControl(null);
  verificado: boolean = false;

  

  enviarCodigoVerificacion() {
    if (this.whatsapp.value && this.correo.value) {
      Swal.fire({
        icon: 'info',
        title: 'Solo llene uno de los dos campos',
      });
      return;
    }
    if (!this.correo.value && !this.whatsapp.value) {
      Swal.fire({
        icon: 'info',
        title: 'Debe proporcionar un correo o un telefono de whatsapp',
      });
      return;
    }
    if (!this.whatsapp.value) {
      console.log('Correo enviado: ' + this.correo.value);
      this.codigoEnviado = true;
    }
    if (!this.correo.value) {
      console.log('Whatsapp enviado: ' + this.whatsapp.value);
      this.codigoEnviado = true;
    }
  }

  verificarCodgio(): boolean {
    if (!this.codigoVerficiacion.value) {
      Swal.fire({
        icon: 'error',
        title: 'Escriba su codigo profavor',
      });
    }
    if (this.codigoVerficiacion.value) {
      console.log('Verificando');
      Swal.fire({
        icon: 'success',
        title: 'Verificado correctamente',
      });
      return (this.verificado = true);
    }
    return false;
  }

  recibirDatosUsuario(event){
    console.log(event)
  }


  mostraUsuario(e) {
    console.log(e);
  }
}
