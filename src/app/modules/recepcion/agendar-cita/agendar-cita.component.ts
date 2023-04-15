import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { flatMap, map } from 'rxjs';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { Institucion } from 'src/app/models/institucion';
import { Paciente } from 'src/app/models/paciente';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AreasService } from 'src/app/services/areas.service';
import { ConceptosService } from 'src/app/services/conceptos.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { PacientesService } from 'src/app/services/pacientes.service';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.css']
})
export class AgendarCitaComponent implements OnInit {

  constructor(
    private pacienteService: PacientesService,
    private institucionService: InstitucionService,
    private areaService: AreasService,
    private conceptoService: ConceptosService,
    private equipoDicomService: EquipoDicomService
  ) {}

  titulo = "Agendar cita";

  autocompleteControlPaciente = new FormControl();
  autocompleteControlConvenio = new FormControl();
  autocompleteControlArea = new FormControl();
  autocompleteControlConcepto = new FormControl();
  
  pacientesFiltrados: Paciente[] = [];
  conveniosFiltrados: Institucion[] = [];
  areasFiltradas: Area[] = [];
  conceptosFiltrados: Concepto[] = [];
  equiposDicom: EquipoDicom[] = [];
  estudios: VentaConceptos[] = [];

  paciente: Paciente;
  institucion: Institucion;
  area: Area;
  concepto: Concepto;
  equipoDicom: EquipoDicom;

  fecha: String;

  ngOnInit(): void {
    this.autocompleteControlPaciente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombreCompleto),
      flatMap(valor => valor ? this.pacienteService.filtrarPorNombre(valor) : [])
    ).subscribe(pacientes => {
      this.pacientesFiltrados = pacientes;
      if(this.estudios?.length>0){
        this.pacientesFiltrados = []; 
      }
    });

    this.autocompleteControlConvenio.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      flatMap(valor => valor ? this.institucionService.buscarLikeNombre(valor) : [])
    ).subscribe(instituciones => this.conveniosFiltrados = instituciones);

    this.autocompleteControlConcepto.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.concepto),
      flatMap(valor => valor && this.area?.id ?  this.conceptoService.buscarLikeNombreEnArea(valor, this.area.id) : [])
    ).subscribe(conceptos => {
      this.conceptosFiltrados = conceptos;
    });

    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      flatMap(valor => valor ? this.areaService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => {
      this.areasFiltradas = areas;
      this.autocompleteControlConcepto.setValue("");
      this.conceptosFiltrados = [];
      this.concepto = null;
    });

  }


  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  mostrarNombreConvenio(convenio?: Institucion): string {
    return convenio ? convenio.nombre : '';
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  mostrarNombreConcepto(concepto ?: Concepto): string {
    return concepto ? concepto.concepto : '';
  }

  seleccionarInstitucion(event: MatAutocompleteSelectedEvent){
    this.institucion = event.option.value as Institucion;
    event.option.deselect();
    event.option.focus();
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent){
    this.area = event.option.value as Area;
   
    event.option.deselect();
    event.option.focus();

    this.cargarEquiposDicom();
  }

  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    this.paciente = event.option.value as Paciente;

    event.option.deselect();
    event.option.focus();
  }

  seleccionarConcepto(event: MatAutocompleteSelectedEvent): void {
    this.concepto = event.option.value as Concepto;
    
    event.option.deselect();
    event.option.focus();
  }

  seleccionarEquipoDicom(event): void {
    this.equipoDicom = event.value as EquipoDicom;

    console.log(this.equipoDicom);

    event.option.deselect();
    event.option.focus();
  }


  private cargarEquiposDicom(): void{
    this.equipoDicomService.filtrarPorArea(this.area.id).subscribe(
      equipos =>{
        this.equiposDicom = equipos;
      }
    );
  }

  agregarEstudio(): void{

    if(!this.datosValidos()){
      return;
    }


    if(this.estudios.length > 0 && this.estudios[0].paciente.id != this.paciente.id){
      this.estudios = [];
      return;
    }

    const estudio = new VentaConceptos;
    estudio.id = this.estudios?.length < 1 ? 1 : this.estudios[this.estudios.length-1].id + 1;
    estudio.concepto = this.concepto;
    estudio.enWorklist = false;
    estudio.equipoDicom = this.equipoDicom;
    estudio.institucion = this.institucion;
    estudio.paciente = this.paciente;

    this.estudios.push(estudio);

    this.limpiarCampos();

   
  }
 
  private limpiarCampos(): void {
    this.area = null;
    this.concepto = null;
    this.equipoDicom = null;

    this.autocompleteControlArea.setValue("");
    this.autocompleteControlConcepto.setValue("");
  }


  datosValidos() : boolean {
    if(this.paciente == null){
      return false;
    }
    if(this.institucion == null){
      return false;
    }
    if(this.area == null){
      return false;
    }
    if(this.estudios == null){
      return false;
    }
    if(this.equipoDicom == null){
      return false;
    }
    return true;
  }

  quitarEstudio(id: number): void{
    this.estudios = this.estudios.filter(estudio => estudio.id !== id);
  }

  agendar(){

  }

  abrirModalRegistrarPaciente(){
    
  }

}
