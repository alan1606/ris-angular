import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Medico } from 'src/app/models/medico';
import { FechaService } from 'src/app/services/fecha.service';
import { MedicoService } from 'src/app/services/medico.service';
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
    public modalRef: MatDialogRef<FormularioMedicosComponent>,
    private medicoService: MedicoService
  ) {}
  modelo = null;
  medico: Medico;
  error: any;
  fecha: string = '';
  form: FormGroup = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    especialidad: new FormControl(''),
    telefono: new FormControl(''),
    correo: new FormControl('', [Validators.required, Validators.email]),
    direccion: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    whatsapp: new FormControl('', [Validators.minLength(10)]),
    sexo: new FormControl(''),
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
        nombres: this.medico.nombres,
        apellidos: this.medico.apellidos,
        especialidad: this.medico.especialidad,
        telefono: this.medico.telefono,
        correo: this.medico.correo,
        direccion: this.medico.direccion,
        fechaNacimiento: this.medico.fechaNacimiento,
        whatsapp: this.medico.whatsapp,
        sexo: this.medico.sexo == 1 ? 1 : 2,
      });
    }
  }

  seleccionarFecha(fecha: HTMLInputElement): void {
    const fechaValor = new Date(this.form.get("fechaNacimiento").value);
    this.form.value.fechaNacimiento = this.fechaService.formatearFecha(fechaValor);
  }

  crear(): void {
    if(!this.datosValidos()){
      return;
    }
    this.medico = this.form.value;
    this.medicoService.crearMedicoReferente(this.medico).subscribe(
      medico => {
        this.medico = medico;
        console.log(medico);
        Swal.fire("Creado", "El médico ha sido creado", "success");
        this.modalRef.close(this.medico);
      },
      error => {
        Swal.fire("Error", "Ha ocurrido un error creando al médico", "error");
        console.log(error);
      }
    );
  
  }

  editar(): void {
    if (!this.datosValidos) {
      return ;
    }

    this.medico = this.form.value;
    this.medico.id = this.data.medicoDatos.id;
    
    console.log("Medico", this.medico);
    this.medicoService.editar(this.medico).subscribe(
      medico => {
        this.medico = medico;
        console.log(medico);
        Swal.fire("Modificado", "El médico ha sido modificado", "success");
        this.modalRef.close(this.medico);
      },
      error => {
        Swal.fire("Error", "Ha ocurrido un error al modificar el médico", "error");
        console.log(error);
      }
    ); 
   }

  cerrar(): void {
    this.modalRef.close();
  }

  private datosValidos(): boolean {
    if (!this.form.value.nombres) {
      Swal.fire('Error', 'Llenar nombre', 'error');
      return false;
    }
    if (!this.form.value.apellidos) {
      Swal.fire('Error', 'Llenar apellidos', 'error');
      return false;
    }
    if (!this.form.value.correo || this.form.value.correo.indexOf('@') === -1) {
      Swal.fire('Error', 'Llenar correo', 'error');
      return false;
    }
    return true;
  }

}
