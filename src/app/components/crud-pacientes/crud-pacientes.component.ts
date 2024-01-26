import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { ESTADO, getPersona, GENERO, generar } from 'curp';
import { UntypedFormControl } from '@angular/forms';
import { PacientesService } from 'src/app/services/pacientes.service';
import Swal from 'sweetalert2';
import { FechaService } from 'src/app/services/fecha.service';

@Component({
  selector: 'app-crud-pacientes',
  templateUrl: './crud-pacientes.component.html',
  styleUrls: ['./crud-pacientes.component.css'],
})
export class CrudPacientesComponent implements OnInit {
  constructor(
    private service: PacientesService,
    private fechaService: FechaService
  ) {}

  fechaNacimientoControl = new UntypedFormControl();
  model: Paciente = new Paciente();
  error: any;
  sexos: string[] = ['MASCULINO', 'FEMENINO'];
  pais: string = '';
  paises: string[] = ['MÉXICO', 'OTRO'];
  entidades = Object.keys(ESTADO);
  entidad: string = '';
  fecha: string = '';
  sexo: string = '';
  ngOnInit(): void {}

  pacienteBuscado(event: any) {
    console.log(event);
    this.model = event;
    this.fechaNacimientoControl.setValue(
      new Date(this.model.fechaNacimiento)
    );
    this.sexo = event.sexo == 2 ? 'MASCULINO' : 'FEMENINO';
  }

  public crear(): void {
    if (!this.camposValidos()) {
      return;
    }

    this.service.crear(this.model).subscribe(
      (model) => {
        this.model = model;
        Swal.fire('Nuevo:', `Paciente creado con éxito`, 'success');
      },
      (err) => {
        if (err.status === 400) {
          this.error = err.error;
          console.log(this.error);
        }
      }
    );
  }

  public editar(): void {
    if (!this.camposValidos()) {
      return;
    }
    this.service.editar(this.model).subscribe(
      (concepto) => {
        console.log(concepto);
        Swal.fire('Modificado: ', `Paciente actualizado con éxito`, 'success');
      },
      (err) => {
        if (err.status === 400) {
          this.error = err.error;
          console.log(this.error);
        }
      }
    );
  }

  private camposValidos(): boolean {
    if (!this.model.nombre) {
      Swal.fire('Error', 'Verifique el nombre', 'error');
      return false;
    }
    if (!this.model.apellidoPaterno) {
      Swal.fire('Error', 'Verifique el apellido paterno', 'error');
      return false;
    }
    if (!this.model.apellidoMaterno) {
      Swal.fire('Error', 'Verifique el apellido materno', 'error');
      return false;
    }
    if (!this.model.fechaNacimiento) {
      Swal.fire('Error', 'Verifique la fecha de nacimiento', 'error');
      return false;
    }
    if (!this.model.sexo) {
      Swal.fire('Error', 'Verifique el sexo', 'error');
      return false;
    }
    return true;
  }

  seleccionarFecha(fecha: HTMLInputElement): void {
    const fechaValor = new Date(this.fechaNacimientoControl.value);
    this.model.fechaNacimiento = this.fechaService.formatearFecha(fechaValor);
    this.model.fechaNacimiento += 'T00:00:00';
    this.fecha = this.fechaService.formatearFecha(fechaValor);

  }

  seleccionarSexo(): void {
    this.model.sexo = this.sexo == 'MASCULINO' ? 2 : 1;
    if (this.datosListosParaGenerarCurp()) {
      this.generarCurp();
    }
  }

  datosListosParaGenerarCurp(): boolean {
    console.log(this.fecha)
    if (this.model?.nombre == '') {
      return false;
    }
    if (this.model?.apellidoPaterno == '') {
      return false;
    }
    if (this.model?.apellidoMaterno == '') {
      return false;
    }
    if (this.fecha == '') {
      return false;
    }
    if (this.pais == '') {
      return false;
    }
    if (this.pais != 'OTRO' && this.entidad == '') {
      return false;
    }
    return true;
  }

  generar() {
   
    if (this.datosListosParaGenerarCurp()) {
      this.generarCurp();
      console.log("pito")
    }

  }

  generarCurp(): void {
    let persona = getPersona();
    persona.nombre = this.model.nombre;
    persona.apellidoPaterno = this.model.apellidoPaterno;
    persona.apellidoMaterno = this.model.apellidoMaterno;
    persona.genero = this.model.sexo == 2 ? GENERO.MASCULINO : GENERO.FEMENINO;
    persona.fechaNacimiento = this.fecha.replace(/\//g, '-');
    console.log(persona.fechaNacimiento);
    persona.estado =
      this.pais == 'OTRO' ? ESTADO['NO_ESPECIFICADO'] : ESTADO[this.entidad];
    this.model.curp = generar(persona);
  }

  mayusculasNombre(): void {
    this.model.nombre = this.model.nombre.toUpperCase();
  }

  mayusculasMaterno(): void {
    this.model.apellidoMaterno = this.model.apellidoMaterno.toUpperCase();
  }

  mayusculasPaterno(): void {
    this.model.apellidoPaterno = this.model.apellidoPaterno.toUpperCase();
  }

  mayusculasCurp(): void {
    this.model.curp = this.model.curp.toUpperCase();
  }
}
