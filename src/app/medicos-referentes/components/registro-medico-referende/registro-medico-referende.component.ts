import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CodigoComprobacion } from 'src/app/models/codigo-comprobacion';
import { CodigosMedicosReferentesService } from '../../services/codigos-medicos-referentes.service';

@Component({
  selector: 'app-registro-medico-referende',
  templateUrl: './registro-medico-referende.component.html',
  styleUrls: ['./registro-medico-referende.component.css'],
})
export class RegistroMedicoReferendeComponent implements OnInit {
  constructor(private comprobarCodigoService: CodigosMedicosReferentesService) {}

  whatsapp: FormControl = new FormControl(null);
  correo: FormControl = new FormControl(null, [Validators.email]);
  codigoEnviado: boolean = false;
  codigoVerficiacion: FormControl = new FormControl(null);
  verificado: boolean = false;
  comprobacion: CodigoComprobacion;
  deshabilitadoEnvio: boolean = false;

  ngOnInit(): void {
  }

  enviarCodigoVerificacion() {
    if (!this.correo.value && !this.whatsapp.value) {
      Swal.fire({
        icon: 'info',
        title: 'Debe proporcionar un correo o un telefono de whatsapp',
      });
      return;
    }
    this.comprobacion = new CodigoComprobacion();

    if (this.whatsapp.value){
      this.comprobacion.whatsapp = this.whatsapp.value;
    }
    if(this.correo.value){
      this.comprobacion.email = this.correo.value;
    }

    this.deshabilitadoEnvio = true;
    this.comprobarCodigoService.mandarCodigoComprobacion(this.comprobacion).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: `Codigo de verificacion enviado`,
        text: 'Puede tardar un momento en llegar',
      });
      this.codigoEnviado = true;
      this.deshabilitadoEnvio = false;
    },
    () => {
      Swal.fire("Error", "Error al enviar el código", "error");
      this.codigoEnviado = false;
      this.deshabilitadoEnvio = false;
    });
    
  }

  verificarCodgio() {
    if (!this.codigoVerficiacion.value) {
      Swal.fire({
        icon: 'error',
        title: 'Escriba su código, por favor',
      });
       this.verificado = false;
    }
    this.comprobacion.code = this.codigoVerficiacion.value;
    this.comprobarCodigoService.verificarCodigoComprobacion(this.comprobacion).subscribe(valido => {
      if(valido){
        Swal.fire({
          icon: 'success',
          title: 'Verificado correctamente',
        });
        this.verificado = true;
      }
      else{
        Swal.fire("Incorrecto", "El código es incorrecto", "error");
        this.verificado = false;
      }
    },
    error => {
      console.error(error);
      Swal.fire("Error", error.error.detail, "error");
      this.verificado = false;
    });
     
    
  }

  recibirDatosUsuario(event) {
    console.log(event);
    this.verificado = false;
    this.codigoEnviado = false;
    Swal.fire("Registrado", "Inicie sesión en la parte superior derecha para comenzar a usar la plataforma", "success");
  }


}
