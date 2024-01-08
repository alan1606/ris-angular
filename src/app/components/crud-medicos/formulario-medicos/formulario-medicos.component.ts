import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Medico } from 'src/app/models/medico';
import { FechaService } from 'src/app/services/fecha.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-medicos',
  templateUrl: './formulario-medicos.component.html',
  styleUrls: ['./formulario-medicos.component.css'],
})
export class FormularioMedicosComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fechaService: FechaService,
    public modalRef: MatDialogRef<FormularioMedicosComponent>
  ) {}
  modelo = null;
  medico: Medico;
  error: any;
  fecha: string = '';
  form: FormGroup = new FormGroup({
    Nombres: new FormControl('', Validators.required),
    Apellidos: new FormControl('', Validators.required),
    Especialidad: new FormControl(''),
    Telefono: new FormControl(''),
    Correo: new FormControl('', [Validators.required, Validators.email]),
    Direccion: new FormControl(''),
    FechaNacimiento: new FormControl(''),
    Whatsapp: new FormControl('', [Validators.minLength(10)]),
    Sexo: new FormControl(''),
  });
  sexos = [
    { label: 'Femenino', value: 1 },
    { label: 'Masculino', value: 2 },
  ];

  ngOnInit(): void {
    if (this.data) {
      this.medico = this.data.medicoDatos;
      console.log(this.medico);
      this.form.patchValue({
        Nombres: this.medico.nombres,
        Apellidos: this.medico.apellidos,
        Especialidad: this.medico.especialidad,
        Telefono: this.medico.telefono,
        Correo: this.medico.correo,
        Direccion: this.medico.direccion,
        FechaNacimiento: this.medico.fechaNacimiento,
        Sexo: this.medico.sexo == 1 ? 1 : 2,
      });
    }
  }

  seleccionarFecha(fecha: HTMLInputElement): void {
    this.fecha = this.fechaService.alistarFechaParaBackend(fecha.value);
    this.form.value.FechaNacimiento = this.fecha;
    // this.form.value.FechaNacimiento += 'T00:00:00';
  }

  Crear(): boolean {
    if (!this.form.value.Nombres) {
      Swal.fire('Error', 'Llenar nombre', 'error');
      return false;
    }
    if (!this.form.value.Apellidos) {
      Swal.fire('Error', 'Llenar apellidos', 'error');
      return false;
    }
    if (!this.form.value.Correo || this.form.value.Correo.indexOf('@') === -1) {
      Swal.fire('Error', 'Llenar correo', 'error');
      return false;
    }
    console.log('creado');
    this.medico = this.form.value;
    console.log(this.medico);
    Swal.fire('Creado', 'Nuevo medico creado', 'success');
    return true;
  }

  Editar(): boolean {
    if (!this.form.value.Nombres) {
      Swal.fire('Error', 'Llenar nombre', 'error');
      return false;
    }
    if (!this.form.value.Apellidos) {
      Swal.fire('Error', 'Llenar apellidos', 'error');
      return false;
    }
    if (!this.form.value.Correo || this.form.value.Correo.indexOf('@') === -1) {
      Swal.fire('Error', 'Llenar correo', 'error');
      return false;
    }
    console.log('editado');
    this.medico = this.form.value;
    console.log(this.medico);
    Swal.fire('Editado', 'Medico editado', 'success');
    return true;
  }

  Cerrar(): void {
    this.modalRef.close();
  }
}
