import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Medico } from 'src/app/models/medico';
import { FechaService } from 'src/app/services/fecha.service';
import { MedicoService } from 'src/app/services/medico.service';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-modal',
  templateUrl: './perfil-modal.component.html',
  styleUrls: ['./perfil-modal.component.css'],
})
export class PerfilModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fechaService: FechaService,
    private medicosService: MedicoService,
    private tokenService: TokenService,
    private pipe: DatePipe
  ) {}

  editarCampos: boolean = true;
  datosUsuario: Medico = new Medico();
  username: string = '';
  fechaNacimientoControl: FormControl = new FormControl({
    value: '',
    disabled: this.editarCampos,
  });
  fecha: string = '';
  sexos: string[] = ['1', '2'];

  ngOnInit(): void {
    this.username = this.tokenService.getUsername();
    this.medicosService.encontrarPorUsuario(this.username).subscribe(
      (datos) => {
        this.datosUsuario = datos;
        this.fechaNacimientoControl.setValue(
          new Date((datos.fechaNacimiento += 'T00:00:00'))
        );
      },
      (error) => console.log(error)
    );
  }

  cambiarEditar() {
    this.editarCampos = !this.editarCampos;
  }

  public actualizarFecha(fecha: HTMLInputElement) {
    console.log(fecha.value);
  }

  seleccionarFecha(): void {
    const fechaValor = new Date(this.fechaNacimientoControl.value);
    this.datosUsuario.fechaNacimiento =
      this.fechaService.formatearFecha(fechaValor);
    this.datosUsuario.fechaNacimiento += 'T00:00:00';
  }
  guardarCambios() {
    this.medicosService
      .modificarMedicoReferentePorUsuario(this.datosUsuario)
      .subscribe(
        (datos) => {
          console.log(datos);
        },
        (error) => {
          console.log(error);
        }
      );
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados',
    });
    this.editarCampos = true;
  }
}
