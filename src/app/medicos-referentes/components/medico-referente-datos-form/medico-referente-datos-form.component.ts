import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Medico } from 'src/app/models/medico';
import { FechaService } from 'src/app/services/fecha.service';
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
  @Input() model: Medico = null;
  sexos: string[] = ['MASCULINO', 'FEMENINO'];
  password2: string = '';
  fechaNacimientoControl = new FormControl();
  medico: Medico;
  sexo: string = '';

  constructor(
    private medicoService: MedicoService,
    private fechaService: FechaService,
  ) {
    this.medico = new Medico();
  }

  ngOnInit(): void {
    if (this.correo) {
      this.medico.correo = this.correo;

      this.medicoService
        .filtrarReferentesPorCorreo(this.correo)
        .subscribe((medico) => {
          //Asignar el médico
          this.medico = medico;
          if (this.medico?.sexo) {
            this.sexo = this.medico.sexo == 1 ? 'FEMENINO' : 'MASCULINO';
          }
          if (this.medico.fechaNacimiento) {
            this.fechaNacimientoControl.setValue(
              new Date(this.medico.fechaNacimiento)
            );
          }
        });
    }
    if (this.whatsapp) {
      this.medico.whatsapp = this.whatsapp;

      this.medicoService
        .filtrarReferentesPorWhatsapp(this.whatsapp)
        .subscribe((medico) => {
          this.medico = medico;
          if (this.medico?.sexo) {
            this.sexo = this.medico.sexo == 1 ? 'FEMENINO' : 'MASCULINO';
          }
          if (this.medico.fechaNacimiento) {
            this.fechaNacimientoControl.setValue(
              new Date(this.medico.fechaNacimiento)
            );
          }
        });
    }
  }

  public registrar() {
    if (!this.datosValidos()) {
      return;
    }

    this.medicoService.crearMedicoReferenteAutorregistro(this.medico).subscribe(
      (medico) => {
        this.medico = medico;
        this.datosUsuario.emit(this.medico);
      },
      (error) => {
        Swal.fire('Error', error.error.detail, 'error');
      }
    );
  }

  private datosValidos(): boolean {
    if (this.medico.password != this.password2) {
      Swal.fire(
        'Verificar contraseña',
        'Las contraseñas no coinciden',
        'error'
      );
      return false;
    }
    return true;
  }

  public seleccionarFecha(): void {
    const fechaValor = new Date(this.fechaNacimientoControl.value);
    this.medico.fechaNacimiento = this.fechaService.formatearFecha(fechaValor);
    this.medico.fechaNacimiento += 'T00:00:00';
  }

  public seleccionarSexo(): void {
    this.medico.sexo = this.sexo == 'MASCULINO' ? 2 : 1;
  }
}
