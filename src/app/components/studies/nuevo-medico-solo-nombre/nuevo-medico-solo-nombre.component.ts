import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Medico } from 'src/app/models/medico';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-medico-solo-nombre',
  templateUrl: './nuevo-medico-solo-nombre.component.html',
  styleUrls: ['./nuevo-medico-solo-nombre.component.css'],
})
export class NuevoMedicoSoloNombreComponent implements OnInit {
  public medico: Medico= new Medico();
  public form: FormGroup = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
  });

  constructor(
    private medicoService: MedicoService,
    public dialogRef: MatDialogRef<NuevoMedicoSoloNombreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Medico = new Medico()
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.form.get('nombres').setValue(this.data.nombres);
      this.form.get('apellidos').setValue(this.data.apellidos);
      this.medico = this.data;
    }
  }

  crear(): void {
    if (!this.datosValidos()) {
      return;
    }
    this.medico = this.form.value;

    this.medicoService.crearMedicoReferentePurosNombre(this.medico).subscribe(
      (medico) => {
        this.medico = medico;
        Swal.fire('Creado', 'El médico ha sido creado', 'success');
        this.dialogRef.close(this.medico);
      },
      (error) => {
        Swal.fire('Error', 'Ha ocurrido un error creando al médico', 'error');
        console.log(error);
      }
    );
  }

  editar(): void {
    if (!this.datosValidos()) {
      return;
    }
    this.medico.nombres = this.form.value.nombres
    this.medico.apellidos = this.form.value.apellidos
    this.medicoService.editar(this.medico).subscribe(
      (medico) => {
        this.medico = medico;
        Swal.fire('Editado', 'El médico ha sido editado', 'success');
        this.dialogRef.close(this.medico);
      },
      (error) => {
        Swal.fire('Error', 'Ha ocurrido un error al editar médico', 'error');
        console.log(error);
      }
    );
  }

  private datosValidos(): boolean {
    if (!this.form.value.nombres) {
      Swal.fire('Error', 'Llenar nombre', 'error');
      return false;
    }
    if (this.data && !this.medico.correo) {
      Swal.fire('Error', 'Llenar el correo', 'error');
      return false;
    }
    return true;
  }
}
