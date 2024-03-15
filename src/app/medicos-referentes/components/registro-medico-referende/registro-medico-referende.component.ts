import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MedicoReferenteService } from '../../services/medico-referente.service';
import { error } from 'console';

@Component({
  selector: 'app-registro-medico-referende',
  templateUrl: './registro-medico-referende.component.html',
  styleUrls: ['./registro-medico-referende.component.css'],
})
export class RegistroMedicoReferendeComponent implements OnInit {
  constructor(private medicosReferentesServiceNestjs: MedicoReferenteService) {}

  whatsapp: FormControl = new FormControl(null);
  correo: FormControl = new FormControl(null, [Validators.email]);
  codigoEnviado: boolean = false;
  codigoVerficiacion: FormControl = new FormControl(null);
  verificado: boolean = false;

  ngOnInit(): void {
    this.medicosReferentesServiceNestjs
      .obtenerMedicosReferentesNestjs()
      .subscribe(
        (datos) => console.log(datos),
        (error) => console.log(error)
      );
  }
  enviarCodigoVerificacion() {
    if (!this.correo.value && !this.whatsapp.value) {
      Swal.fire({
        icon: 'info',
        title: 'Debe proporcionar un correo o un telefono de whatsapp',
      });
      return;
    }
    if (this.whatsapp.value && this.correo.value) {
      return;
    }
    if (this.whatsapp.value) {
      console.log('Whatsapp enviado: ' + this.whatsapp.value);
      Swal.fire({
        icon: 'success',
        title: `Codigo de verificacion enviado a whatsapp`,
        text: 'Puede tardar un momento en llegar',
      });
      this.codigoEnviado = true;
      return;
    }
    if (this.correo.value) {
      console.log('Correo enviado: ' + this.correo.value);
      Swal.fire({
        icon: 'success',
        title: `Codigo de verificacion enviado al correo`,
        text: 'Puede tardar un momento en llegar',
      });
      this.codigoEnviado = true;
      return;
    }
  }

  verificarCodgio() {
    if (!this.codigoVerficiacion.value) {
      Swal.fire({
        icon: 'error',
        title: 'Escriba su código, por favor',
      });
      return (this.verificado = false);
    }
    if (this.codigoVerficiacion.value) {
      Swal.fire({
        icon: 'success',
        title: 'Verificado correctamente',
      });
      return (this.verificado = true);
    }
    return (this.verificado = false);
  }

  recibirDatosUsuario(event) {
    console.log(event);
  }

  mostraUsuario(e) {
    console.log(e);
  }
}
