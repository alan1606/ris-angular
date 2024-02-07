import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { PacientesService } from 'src/app/services/pacientes.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ESTADO, getPersona, GENERO, generar } from 'curp';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, EMPTY } from 'rxjs';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { FechaService } from 'src/app/services/fecha.service';

@Component({
  selector: 'app-registro-completo-paciente',
  templateUrl: './registro-completo-paciente.component.html',
  styleUrls: ['./registro-completo-paciente.component.css'],
})
export class RegistroCompletoPacienteComponent implements OnInit {
  fechaNacimientoControl = new FormControl();

  model: Paciente = new Paciente();
  titulo: string = 'Crear paciente';
  error: any;
  sexos: string[] = ['MASCULINO', 'FEMENINO'];
  pais: string = '';
  paises: string[] = ['MÉXICO', 'OTRO'];
  entidades = Object.keys(ESTADO);
  entidad: string = '';
  fecha: string = '';
  sexo: string = '';
  orden: OrdenVenta;

  constructor(
    private service: PacientesService,
    private route: ActivatedRoute,
    private ordenVentaService: OrdenVentaService,
    private pipe: DatePipe,
    private router: Router,
    private fechaService: FechaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idPaciente: number = +params.get('idPaciente');
      const idOrden: number = +params.get('idOrden');
      if (idPaciente && idOrden) {
        this.ordenVentaService
          .ver(idOrden)
          .pipe(
            switchMap((orden) => {
              this.orden = orden;
              if (this.orden.paciente.id !== idPaciente) {
                this.router.navigate(['/']);
                // Devolver un observable vacío para evitar que continúe el flujo de datos.
                return EMPTY; // Asegúrate de importar EMPTY de 'rxjs'
              }
              // Si el paciente es correcto, realizamos la llamada al servicio de paciente.
              return this.service.ver(idPaciente);
            })
          )
          .subscribe(
            (paciente) => {
              if (paciente) {
                this.model = paciente;
                if(this.model?.sexo){
                  this.sexo = this.model.sexo == 1 ? 'FEMENINO' : 'MASCULINO';
                }
                if(this.model.fechaNacimiento){
                  this.fecha = this.pipe.transform(
                    new Date(this.model.fechaNacimiento),
                    'MM/dd/yyyy'
                  );
                  this.fechaNacimientoControl.setValue(
                    new Date(this.model.fechaNacimiento)
                  );
                }
                Swal.fire("Información", "Llene sus datos y haga clic en guardar", "info");
              }
            },
            (error) => {
              // Manejar errores aquí si es necesario
              console.error(error);
            }
          );
      }
    });
  }

  public crear(): void {

    if(!this.camposValidos()){
      return;
    }
    
    this.service.crear(this.model).subscribe(
      (model) => {
        this.model = model;
        Swal.fire('Nuevo:', `Paciente creado con éxito`, 'success');
      },
      (err) => {
        this.error = err.error;
        console.log(this.error);
        Swal.fire("Error", "Ocurrió un error", "error");
      }
    );
  }

  public editar(): void {
    if(!this.camposValidos()){
      return;
    }

    this.service.editar(this.model).subscribe(
      (concepto) => {
        console.log(concepto);
        Swal.fire('Modificado: ', `Paciente actualizado con éxito`, 'success');
      },
      (err) => {
        this.error = err.error;
        console.log(this.error);
        Swal.fire("Error", "Ocurrió un error", "error");
      }
    );
  }

  seleccionarFecha(fecha: HTMLInputElement): void {
    const fechaValor = new Date(this.fechaNacimientoControl.value);
    this.model.fechaNacimiento = this.fechaService.formatearFecha(fechaValor);
    this.model.fechaNacimiento += "T00:00:00";

  }


  private camposValidos():boolean{
    if(!this.model.nombre){
      Swal.fire("Error", "Verifique el nombre", "error");
      return false;
    }
    if(!this.model.apellidoPaterno){
      Swal.fire("Error", "Verifique el apellido paterno", "error");
      return false;
    }
    if(!this.model.apellidoMaterno){
      Swal.fire("Error", "Verifique el apellido materno", "error");
      return false;
    }
    if(!this.model.fechaNacimiento){
      Swal.fire("Error", "Verifique la fecha de nacimiento", "error");
      return false;
    }
    if(!this.model.sexo){
      Swal.fire("Error", "Verifique el sexo", "error");
      return false;
    }
    return true;
  }

  seleccionarSexo(): void {
    this.model.sexo = this.sexo == 'MASCULINO' ? 2 : 1;
    if (this.datosListosParaGenerarCurp()) {
      this.generarCurp();
    }
  }

  generar(){
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
    console.log(persona);
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
