import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Medico } from 'src/app/models/medico';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico-referente-datos-form',
  templateUrl: './medico-referente-datos-form.component.html',
  styleUrls: ['./medico-referente-datos-form.component.css'],
})
export class MedicoReferenteDatosFormComponent implements OnInit {
  @Output() datosUsuario = new EventEmitter<{}>();

  @Input() correo?: string = null;
  @Input() whatsapp?: string = null;

  constructor(
    private medicoService: MedicoService
  ){}

  form: FormGroup = new FormGroup({
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    especialidad: new FormControl(''),
    usuario: new FormControl(''),
    email: new FormControl(''),
    whatsapp: new FormControl(''),
    cedula: new FormControl(''),
    cedulaEsp: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    telefono: new FormControl(''),
    direccion: new FormControl(''),
  });

  medico: Medico;

  ngOnInit(): void {
    if (this.correo) {
      this.medicoService.filtrarReferentesPorCorreo(this.correo).subscribe(
        medico => {
          //Asignar el médico
          this.medico = medico;
          console.log(this.medico);
        }
      );
    }
    if (this.whatsapp) {
      this.medicoService.filtrarReferentesPorWhatsapp(this.whatsapp).subscribe(
        medico => {
          //Asignar el médico
          this.medico = medico;
          console.log(this.medico);
        }
      );
    }
  }

  registrar() {

    if(!this.datosValidos()){
      return;
    }

    this.medicoService.crearMedicoReferenteAutorregistro(this.medico).subscribe(
      medico => {
        this.medico = medico;
        this.datosUsuario.emit(this.medico);
      },
      error => {
        console.error(error);
      }
    );
  }


  private datosValidos(): boolean{
    if(this.form.get('password').value != this.form.get('confirmPassword').value){
      Swal.fire("Verificar contraseña","Las contraseñas no coinciden", "error");
      return false;
    }
    return true;
  }
}
