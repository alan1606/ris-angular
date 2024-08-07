import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Paciente } from 'src/app/models/paciente';
import { PacientesService } from 'src/app/services/pacientes.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ESTADO, getPersona, GENERO, generar } from 'curp';
import { UntypedFormControl } from '@angular/forms';
import { FechaService } from 'src/app/services/fecha.service';

@Component({
  selector: 'app-registrar-paciente',
  templateUrl: './registrar-paciente.component.html',
  styleUrls: ['./registrar-paciente.component.css']
})
export class RegistrarPacienteComponent implements OnInit {

  fechaNacimientoControl = new UntypedFormControl();
  model: Paciente = new Paciente();

  titulo: string = "Crear paciente";
  error: any;
  sexos: string[] = ["MASCULINO", "FEMENINO"];
  pais: string = '';
  paises: string[] = ["MÉXICO", "OTRO"];
  entidades = Object.keys(ESTADO);
  entidad: string = '';
  fecha: string = '';
  sexo: string = '';

  constructor(
    private service: PacientesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<RegistrarPacienteComponent>,
    private pipe: DatePipe,
    private fechaService: FechaService
  ) {
  }


  ngOnInit(): void {
    if (this.data?.paciente?.id) {
      this.model = this.data?.paciente as Paciente;
      if(this.model.sexo){
        this.sexo = this.model.sexo == 1 ? "FEMENINO" : "MASCULINO";
      }
      if(this.model.fechaNacimiento){
        this.fecha = this.pipe.transform(new Date(this.model.fechaNacimiento), 'MM/dd/yyyy');
        this.fechaNacimientoControl.setValue(new Date(this.model.fechaNacimiento));
      }
    }

  }


  public crear(): void {

    if(!this.camposValidos()){
      return;
    }
    this.model.nombre = this.model.nombre.trim().toUpperCase();
    this.model.apellidoPaterno = this.model.apellidoPaterno.trim().toUpperCase();
    this.model.apellidoMaterno = this.model.apellidoMaterno.trim().toUpperCase();
    this.service.crear(this.model).subscribe(paciente => {
      this.model = paciente;
      Swal.fire('Nuevo:', `Paciente creado con éxito`, 'success');
      this.modalRef.close(paciente);
    }, err => {
      if (err.status === 400) {
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  public editar(): void {

    if(!this.camposValidos()){
      return;
    }
    this.model.nombre = this.model.nombre.trim().toUpperCase();
    this.model.apellidoPaterno = this.model.apellidoPaterno.trim().toUpperCase();
    this.model.apellidoMaterno = this.model.apellidoMaterno.trim().toUpperCase();
    this.service.editar(this.model).subscribe(paciente => {
      Swal.fire('Modificado: ', `Paciente actualizado con éxito`, "success");
      this.modalRef.close(paciente);
    }, err => {
      if (err.status === 400) {
        this.error = err.error;
        console.log(this.error);
      }
    });
  }
  
  private camposValidos():boolean{
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
    if(!this.model.fechaNacimiento){
      Swal.fire("Error", "Verifique la fecha de nacimiento", "error");
      return false;
    }
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

  public cerrar() {
    this.modalRef.close();
  }

  seleccionarFecha(fecha: HTMLInputElement): void {
    const fechaValor = new Date(this.fechaNacimientoControl.value);
    this.model.fechaNacimiento = this.fechaService.formatearFecha(fechaValor);
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

  generar(){
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
