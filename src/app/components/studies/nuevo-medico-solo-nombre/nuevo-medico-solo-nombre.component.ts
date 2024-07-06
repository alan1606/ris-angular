import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Medico } from 'src/app/models/medico';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-medico-solo-nombre',
  templateUrl: './nuevo-medico-solo-nombre.component.html',
  styleUrls: ['./nuevo-medico-solo-nombre.component.css']
})
export class NuevoMedicoSoloNombreComponent implements OnInit {

  constructor(
    private medicoService: MedicoService,
    public dialogRef: MatDialogRef<NuevoMedicoSoloNombreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
  }

  private medico : Medico;

  form: FormGroup = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
  }


  crear(){
    if(!this.datosValidos()){
      return;
    }

    this.medico = this.form.value;

    this.medicoService.crearMedicoReferentePurosNombre(this.medico).subscribe(
      medico => {
        this.medico = medico;
        console.log(medico);
        Swal.fire("Creado", "El médico ha sido creado", "success");
        this.dialogRef.close(this.medico);
      },
      error => {
        Swal.fire("Error", "Ha ocurrido un error creando al médico", "error");
        console.log(error);
      }
    );
  }

  private datosValidos(): boolean{
    if (!this.form.value.nombres) {
      Swal.fire('Error', 'Llenar nombre', 'error');
      return false;
    }
    if (!this.form.value.apellidos) {
      Swal.fire('Error', 'Llenar apellidos', 'error');
      return false;
    }
    return true;
  }
}
