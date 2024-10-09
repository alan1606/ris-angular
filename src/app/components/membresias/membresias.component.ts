import { Component, signal } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { ESTADO, getPersona, GENERO, generar } from 'curp';
import { UntypedFormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { FechaService } from 'src/app/services/fecha.service';
import { DatePipe } from '@angular/common';
import { MembresiaService } from 'src/app/services/membresia.service';
import { Membresia } from 'src/app/models/membresia';
import { MatDialog } from '@angular/material/dialog';
// import { QrFirmarPoliticasMembresiaComponent } from '../qr-firmar-politicas-membresia/qr-firmar-politicas-membresia.component';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { FirmarMembresiaComponent } from './firmar-membresia/firmar-membresia.component';
import { BASE_ENDPOINT } from 'src/app/config/app';

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
  public guardado = signal<boolean>(false);
  public descargar = signal<boolean>(false);
  public generandoCodigo = signal<boolean>(false);
  private urlFirma = BASE_ENDPOINT + '/ris/multimedia/archivo/';

  pacienteBuscado(event: any) {
    this.model = event;
    this.fechaNacimientoControl.setValue(new Date(this.model.fechaNacimiento));
    this.sexo = event.sexo == 2 ? 'MASCULINO' : 'FEMENINO';
    this.guardado.set(false);
    this.descargar.set(false);
    this.codigoMembresia = '';
    this.generandoCodigo.set(false);
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
    } else {
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
    if (!this.model.telefono) {
      Swal.fire('Error', 'Verifique el telefono', 'error');
      return false;
    }
    if (!this.codigoMembresia) {
      Swal.fire('Error', 'Ingrese la membresía', 'error');
      return false;
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
        this.guardado.set(true);
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
    let datos = {
      model: this.model,
      codigoMembresia: this.codigoMembresia,
    };
    const dialogRef = this.dialog.open(FirmarMembresiaComponent, {
      width: '95vw',
      data: datos,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        console.log(data);
        let nombreArchivo = `${data?.idPaciente}-firma.png`;
        this.urlFirma = this.urlFirma + nombreArchivo;
        this.descargar.set(true);
      }
    });
    // const dialogref = this.dialog.open(QrFirmarPoliticasMembresiaComponent, {
    //   data: { paciente: this.model, membresia: this.codigoMembresia },
    // });
  }

  public generarCodigoMembresia(): void {
    this.generandoCodigo.set(true);
    this.membresiaService.generateCode().subscribe(
      (data) => {
        console.log(data);
        // this.membresiaManual.set(true);
        this.codigoMembresia = data[0];
        this.generandoCodigo.set(false);
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }
  public descargarMembresia(): void {
    if (!this.model.nombreCompleto) {
      return;
    }
    let limpio = this.model.nombreCompleto.replace(/ /g, '-');
    let url = `https://diagnocons.com/v1/libs/pdf2/examples/memberRis.php?frontal=https://diagnocons.com/v1/ldContent/uploads/8387a21afc077f597d5bc6b5874c2495.jpeg&tracera=https://diagnocons.com/v1/ldContent/uploads/0a63d25b7a9fa9afc792f4c3142fbb2c.jpeg&cantidad=1&uuid=${this.codigoMembresia}&nameMember=${limpio}&firma=${this.urlFirma}&idPatient=${this.model.id}`;
    window.open(url);
  }
  public descargarContrato(): void {
    let limpio = this.model.nombreCompleto.replace(/ /g, '%20');
    let url = `https://diagnocons.com/v1/libs/pdf2/examples/contratoA.php?firma=${this.urlFirma}&nameMember=${limpio}&idPatient=${this.model.id}`;

    window.open(url);
  }
  public abrirWhatsappMember(){
    if (!this.model.telefono) {
      return;
    }
    let url = `https://wa.me/52${this.model.telefono}?text=Hola ${this.model.nombreCompleto} te haz afiliado de manera exitosa, te adjuntare tu membresia digital en PDF`;
    window.open(url);
  }
}
