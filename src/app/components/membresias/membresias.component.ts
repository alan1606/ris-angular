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
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { PacientesService } from 'src/app/services/pacientes.service';

@Component({
  selector: 'app-membresias',
  templateUrl: './membresias.component.html',
  styleUrls: ['./membresias.component.css'],
})
export class MembresiasComponent {
  constructor(
    private dialog: MatDialog,
    private fechaService: FechaService,
    private pipe: DatePipe,
    private membresiaService: MembresiaService,
    private alertaService: AlertaService,
    private pacienteService: PacientesService
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

  pacienteBuscado(event: any) {
    this.model = event;
    this.fechaNacimientoControl.setValue(new Date(this.model.fechaNacimiento));
    this.sexo = event.sexo == 2 ? 'MASCULINO' : 'FEMENINO';
  }

  public crear(): void {
    if (!this.camposValidos()) {
      return;
    }
    //proceso si no hay paciente
    if (!this.model.id) {
      console.log('proceso si no hay paciente');
      Swal.fire({
        icon: 'info',
        title: 'No existe el paciente',
        text: 'espere mientras se guarda...',
        timer: 4000,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false,
      }).then(() => {
        this.pacienteService.crear(this.model).subscribe(
          (paciente) => {
            this.model = paciente;
            Swal.fire({
              icon: 'success',
              title: 'Paciente guardado',
              text: 'creando la membresia...',
              timer: 4000,
              timerProgressBar: true,
              allowOutsideClick: false,
              showConfirmButton: false,
            }).then(() => {
              this.crearMembresia();
            });
          },
          (error) => {
            console.log(error);
            return;
          }
        );
      });
      return;
    }
    //proceso si hay paciente
    if (this.model.id) {
      console.log('proceso si hay paciente');
      this.crearMembresia();
      return;
    }
    //por defecto
    else {
      console.log('por defecto');
      return;
    }
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

  private crearMembresia(): void {
    let membresia: Membresia = new Membresia();
    membresia.codigoMembresia = this.codigoMembresia;
    membresia.paciente = this.model;
    this.membresiaService.crear(membresia).subscribe(
      () => {
        Swal.fire({
          title: 'Creado',
          text: 'Membresia creada con éxito',
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'cerrar',
          allowOutsideClick: false,
        });
      },
      (error) => {
        console.log(error);
        return;
      }
    );
  }

  abrirQrFirmarPoliticasMembresiaModal() {
    if (!this.model.id) {
      this.alertaService.info(
        'Error al guardar la firma',
        'Primero se debe crear'
      );
      console.log('falta el id');
      return;
    }
    const dialogref = this.dialog.open(QrFirmarPoliticasMembresiaComponent, {
      data: { paciente: this.model, membresia: this.codigoMembresia },
    });
  }
}
