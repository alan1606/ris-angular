import {
  Component,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { PacientesService } from 'src/app/services/pacientes.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ESTADO, getPersona, GENERO, generar } from 'curp';
import { UntypedFormControl } from '@angular/forms';
import { FechaService } from 'src/app/services/fecha.service';

@Component({
  selector: 'app-formulario-paciente',
  templateUrl: './formulario-paciente.component.html',
  styleUrls: ['./formulario-paciente.component.css'],
})
export class FormularioPacienteComponent implements OnChanges {
  fechaNacimientoControl = new UntypedFormControl();

  @Input()
  model: Paciente;
  titulo: string = 'Datos del paciente';
  error: any;
  sexos: string[] = ['MASCULINO', 'FEMENINO'];
  pais: string = '';
  paises: string[] = ['MÉXICO', 'OTRO'];
  entidades = Object.keys(ESTADO);
  entidad: string = '';
  fecha: string = '';
  sexo: string = '';
  @Output() botonGuardarPresionado = new EventEmitter<boolean>();

  constructor(
    private service: PacientesService,
    private pipe: DatePipe,
    private fechaService: FechaService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.model.sexo){
      this.sexo = this.model.sexo == 1 ? 'FEMENINO' : 'MASCULINO';
    }
    if (this.model.fechaNacimiento) {
      this.fecha = this.pipe.transform(
        new Date(this.model.fechaNacimiento),
        'MM/dd/yyyy'
      );
      this.fechaNacimientoControl.setValue(
        new Date(this.model.fechaNacimiento)
      );
    }
  }

  public crear(): void {
    if (!this.camposValidos()) {
      return;
    }
    this.model.nombre = this.model.nombre.trim().toUpperCase();
    this.model.apellidoPaterno = this.model.apellidoPaterno.trim().toUpperCase();
    this.model.apellidoMaterno = this.model.apellidoMaterno.trim().toUpperCase();
    this.service.crear(this.model).subscribe(
      (model) => {
        this.model = model;
        Swal.fire('Nuevo:', `Paciente creado con éxito`, 'success');
        this.botonGuardarPresionado.emit(true);
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
    this.model.nombre = this.model.nombre.trim().toUpperCase();
    this.model.apellidoPaterno = this.model.apellidoPaterno.trim().toUpperCase();
    this.model.apellidoMaterno = this.model.apellidoMaterno.trim().toUpperCase();
    this.service.editar(this.model).subscribe(
      (concepto) => {
        console.log(concepto);

        this.botonGuardarPresionado.emit(true);
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

  seleccionarFecha(fecha: HTMLInputElement): void {
    const fechaValor = new Date(this.fechaNacimientoControl.value);
    this.model.fechaNacimiento = this.fechaService.formatearFecha(fechaValor);
    this.model.fechaNacimiento += 'T00:00:00';
  }

  seleccionarSexo(): void {
    this.model.sexo = this.sexo == 'MASCULINO' ? 2 : 1;
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

  generar() {
    console.log('Tratando de generar');
    if (this.datosListosParaGenerarCurp()) {
      console.log('Listo para generar');
      this.generarCurp();
    }
  }
}
