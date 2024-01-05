import { Component, Input, OnChanges, EventEmitter, Output, SimpleChanges } from '@angular/core';
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
  styleUrls: ['./formulario-paciente.component.css']
})
export class FormularioPacienteComponent implements OnChanges {

  fechaNacimientoControl = new UntypedFormControl();

  @Input()
  model: Paciente;
  titulo: string = "Datos del paciente";
  error: any;
  sexos: string[] = ["MASCULINO", "FEMENINO"];
  pais: string = '';
  paises: string[] = ["MÉXICO", "OTRO"];
  entidades = Object.keys(ESTADO);
  entidad: string = '';
  fecha: string = '';
  sexo: string = '';
  @Output() botonGuardarPresionado = new EventEmitter<boolean>();

  constructor(
    private service: PacientesService,
    private pipe: DatePipe,
    private fechaService: FechaService
  ) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.sexo = this.model.sexo == 1 ? "FEMENINO" : "MASCULINO";
    this.fecha = this.pipe.transform(new Date(this.model.fechaNacimiento), 'MM/dd/yyyy');
    this.fechaNacimientoControl.setValue(new Date(this.model.fechaNacimiento));
  }


  public crear(): void {
    this.service.crear(this.model).subscribe(model => {
      this.model = model;
      Swal.fire('Nuevo:', `Paciente creado con éxito`, 'success');
      this.botonGuardarPresionado.emit(true);
    }, err => {
      if (err.status === 400) {
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  public editar(): void {
    this.service.editar(this.model).subscribe(concepto => {
      console.log(concepto);
      Swal.fire('Modificado: ', `Paciente actualizado con éxito`, "success");
      this.botonGuardarPresionado.emit(true);
      Swal.fire('Pagar', 'Presione el botón de pagar', "info");
    }, err => {
      if (err.status === 400) {
        this.error = err.error;
        console.log(this.error);
      }
    });
  }


  seleccionarFecha(fecha: HTMLInputElement): void {
    this.fecha = fecha.value;
    this.model.fechaNacimiento = this.fechaService.alistarFechaParaBackend(this.fecha);
    this.model.fechaNacimiento += "T00:00:00";
  }


  seleccionarSexo(): void {
    this.model.sexo = this.sexo == "MASCULINO" ? 2 : 1;
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
    persona.fechaNacimiento = this.fecha;
    persona.estado = this.pais == 'OTRO' ? ESTADO['NO_ESPECIFICADO'] : ESTADO[this.entidad];
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
