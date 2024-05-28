import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UntypedFormControl } from '@angular/forms';
import { Paciente } from 'src/app/models/paciente';
import { FechaService } from 'src/app/services/fecha.service';
import { ESTADO, getPersona, GENERO, generar } from 'curp';
import { PacientesService } from 'src/app/services/pacientes.service';
@Component({
  selector: 'app-crud-pacientes',
  templateUrl: './crud-pacientes.component.html',
  styleUrls: ['./crud-pacientes.component.css'],
})
export class CrudPacientesComponent {
  constructor(
    private fechaService: FechaService,
    private pipe: DatePipe,
    private pacientesService: PacientesService
  ) {}
  model: Paciente = new Paciente();
  error: any;
  fecha: string = '';
  pais: string = '';
  sexos: string[] = ['MASCULINO', 'FEMENINO'];
  sexo: string = '';
  paises: string[] = ['MÉXICO', 'OTRO'];
  entidades = Object.keys(ESTADO);
  entidad: string = '';
  fechaNacimientoControl: UntypedFormControl = new UntypedFormControl();

  recibirPacienteDelBuscador(event: Paciente) {
    this.model = event;
    if(this.model.fechaNacimiento){
      this.fechaNacimientoControl.setValue(new Date(this.model.fechaNacimiento));
    }
    if(event.sexo){
      this.sexo = event.sexo == 2 ? 'MASCULINO' : 'FEMENINO';
    }
  }

  seleccionarFecha(fecha: HTMLInputElement): void {
    const fechaValor = new Date(this.fechaNacimientoControl.value);
    this.model.fechaNacimiento = this.fechaService.formatearFecha(fechaValor);
    this.model.fechaNacimiento += 'T00:00:00';
    this.fecha = this.pipe.transform(this.model.fechaNacimiento, 'dd-MM-yyyy');
  }
  generar() {
    if (this.datosListosParaGenerarCurp()) {
      this.generarCurp();
    }
  }
  datosListosParaGenerarCurp(): boolean {
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
  generarCurp(): void {
    let persona = getPersona();
    persona.nombre = this.model.nombre;
    persona.apellidoPaterno = this.model.apellidoPaterno;
    persona.apellidoMaterno = this.model.apellidoMaterno;
    persona.genero = this.model.sexo == 2 ? GENERO.MASCULINO : GENERO.FEMENINO;
    this.fecha = this.pipe.transform(this.model.fechaNacimiento, 'dd-MM-yyyy');

    persona.fechaNacimiento = this.fecha;

    persona.estado =
      this.pais == 'OTRO' ? ESTADO['NO_ESPECIFICADO'] : ESTADO[this.entidad];
    this.model.curp = generar(persona);
  }
  seleccionarSexo(): void {
    this.model.sexo = this.sexo == 'MASCULINO' ? 2 : 1;
    if (this.datosListosParaGenerarCurp()) {
      this.generarCurp();
    }
  }
  public crear(): void {
    if (!this.camposValidos()) {
      return;
    }
    this.pacientesService.crear(this.model).subscribe(
      (model) => {
        this.model = model;
        Swal.fire('Nuevo:', `Paciente creado con éxito`, 'success');
        this.limpiarCampos();
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
    this.pacientesService.editar(this.model).subscribe(
      (concepto) => {
        console.log(concepto);
        Swal.fire('Modificado: ', `Paciente actualizado con éxito`, 'success');
        this.limpiarCampos();
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
    if(this.fechaNacimientoControl.status == 'INVALID'){
      let partesFecha = [];
      partesFecha = this.fechaNacimientoControl.errors['matDatepickerParse'].text.split('/');
      if(partesFecha.length != 3){
        Swal.fire('Error', 'La fecha debe tener /', 'error');
        return false;
      }
      const dia = partesFecha[0];
      const mes = partesFecha[1];
      const anio = partesFecha[2];

      const fechaValor = new Date(`${mes}/${dia}/${anio}`);
      this.model.fechaNacimiento = this.fechaService.formatearFecha(fechaValor);
      this.model.fechaNacimiento += 'T00:00:00';
      this.fechaNacimientoControl.setValue(new Date(this.model.fechaNacimiento));

    }
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

  private limpiarCampos(): void {
    this.model = new Paciente();
  }
}
