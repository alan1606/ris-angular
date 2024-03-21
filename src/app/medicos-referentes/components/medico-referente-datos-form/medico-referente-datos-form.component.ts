import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico-referente-datos-form',
  templateUrl: './medico-referente-datos-form.component.html',
  styleUrls: ['./medico-referente-datos-form.component.css'],
})
export class MedicoReferenteDatosFormComponent implements OnInit {
  @Output() datosUsuario = new EventEmitter<{}>();

  @Input() correo?: String = null;
  @Input() whatsapp?: String = null;

  form: FormGroup = new FormGroup({
    usuario: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    telefono: new FormControl(''),
    direccion: new FormControl(''),
  });

  ngOnInit(): void {
    if (this.correo) {
    }
    if (this.whatsapp) {
    }
  }

  registrar() {

    if(!this.datosValidos()){
      return;
    }

    this.datosUsuario.emit(this.form.value);
  }


  private datosValidos(): boolean{
    if(this.form.get('password').value != this.form.get('confirmPassword').value){
      Swal.fire("Verificar contraseña","Las contraseñas no coinciden", "error");
      return false;
    }
    return true;
  }
}
