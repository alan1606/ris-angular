import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
    this.datosUsuario.emit(this.form.value);
  }
}
