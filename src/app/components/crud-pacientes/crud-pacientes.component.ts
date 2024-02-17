import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { ESTADO, getPersona, GENERO, generar } from 'curp';
import { UntypedFormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { FechaService } from 'src/app/services/fecha.service';
import { DatePipe } from '@angular/common';
import { MembresiaService } from 'src/app/services/membresia.service';
import { Membresia } from 'src/app/models/membresia';
import { MatDialog } from '@angular/material/dialog';
import { QrFirmarPoliticasMembresiaComponent } from '../qr-firmar-politicas-membresia/qr-firmar-politicas-membresia.component';

@Component({
  selector: 'app-crud-pacientes',
  templateUrl: './crud-pacientes.component.html',
  styleUrls: ['./crud-pacientes.component.css'],
})
export class CrudPacientesComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private fechaService: FechaService,
    private pipe: DatePipe,
    private membresiaService: MembresiaService
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
  codigoMembresia: string = '';

  ngOnInit(): void {
    
  }

  pacienteBuscado(event: any) {
    this.model = event;
    this.fechaNacimientoControl.setValue(new Date(this.model.fechaNacimiento));
    this.sexo = event.sexo == 2 ? 'MASCULINO' : 'FEMENINO';
  }

  public crear(): void {
    if (!this.camposValidos()) {
      return;
    }
    let membresia: Membresia = new Membresia();
    membresia.codigoMembresia = this.codigoMembresia;
    membresia.paciente = this.model;

    this.membresiaService.crear(membresia).subscribe(
      () => {
        Swal.fire('Creado', 'Membresia creada con éxito', 'success');
        this.model = new Paciente();
        this.codigoMembresia = '';
      },
      (e) => {
        Swal.fire('Error', 'No se pudo crear la membresía', 'error');
        console.log(e);
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
    if (!this.codigoMembresia) {
      Swal.fire('Error', 'Ingrese la membresía', 'error');
    }
    return true;
  }

  seleccionarFecha(fecha: HTMLInputElement): void {
    const fechaValor = new Date(this.fechaNacimientoControl.value);
    this.model.fechaNacimiento = this.fechaService.formatearFecha(fechaValor);
    this.model.fechaNacimiento += 'T00:00:00';
    this.fecha = this.pipe.transform(this.model.fechaNacimiento, 'dd-MM-yyyy');
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

  generar() {
    if (this.datosListosParaGenerarCurp()) {
      this.generarCurp();
    }
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

  abrirQrFirmarPoliticasMembresiaModal() {    
    const dialogref = this.dialog.open(QrFirmarPoliticasMembresiaComponent, {
      data: { paciente: this.model, membresia:this.codigoMembresia },
    });
  }
}
