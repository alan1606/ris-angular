import { Component, OnInit } from '@angular/core';
import {
  EmailValidator,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { title } from 'process';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registro-medico-referende',
  templateUrl: './registro-medico-referende.component.html',
  styleUrls: ['./registro-medico-referende.component.css'],
})
export class RegistroMedicoReferendeComponent implements OnInit {
  correoElectronicoInput: FormControl<string> = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  correoElectronico: String = null;
  correosEncontrados: String[] = null;
  codigoVerificacion: FormControl<string> = new FormControl(null);

  form: FormGroup = new FormGroup({
    Usuario: new FormControl(''),
    Password: new FormControl(''),
    ConfirmPassword: new FormControl(''),
    Telefono: new FormControl(''),
    Direccion: new FormControl(''),
  });

  constructor(private medicoService: MedicoService) {}

  ngOnInit(): void {}

  enviarCorreoVerificacion() {
    this.correoElectronico = this.correoElectronicoInput.value;
    if (this.correoElectronico) {
      this.medicoService.enviarCorreoVerificacion(this.correoElectronico);
    }
    return;
    // this.correosEncontrados=[]
    // let busqueda = this.medicoService.encontrarMedicoReferentePorCorreo(this.correoElectronicoInput.value);

    // if (busqueda) {
    //   if (this.correosEncontrados[0] === busqueda) {
    //     this.correoElectronico = null;
    //     return;
    //   }
    //   this.correosEncontrados.push(busqueda);
    //   this.correoElectronico = null;
    // }
    // this.correoElectronico = this.correoElectronicoInput.value;
    // return;
  }

  enviarCodigoVerificacion() {
    const res = this.medicoService.verificarCodigo(
      this.codigoVerificacion.value
    );
    if (!res) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'error',
      });
    }
    this.correosEncontrados = res;
  }

  registrarUsuario() {
    console.log(this.form.value);
  }

  mostraUsuario(e) {
    console.log(e);
  }
}
