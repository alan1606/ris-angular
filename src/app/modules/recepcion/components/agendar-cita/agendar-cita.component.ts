import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { flatMap, map } from 'rxjs';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { Institucion } from 'src/app/models/institucion';
import { Medico } from 'src/app/models/medico';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Paciente } from 'src/app/models/paciente';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AreasService } from 'src/app/services/areas.service';
import { ConceptosService } from 'src/app/services/conceptos.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { MedicoService } from 'src/app/services/medico.service';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { QrSubirFotoOrdenModalComponent } from '../qr-subir-foto-orden-modal/qr-subir-foto-orden-modal.component';
import { RegistrarPacienteComponent } from '../registrar-paciente-modal/registrar-paciente.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.component.html',
  styleUrls: ['./agendar-cita.component.css']
})
export class AgendarCitaComponent implements OnInit {

  motivo: string;

  constructor(
    private dialog: MatDialog,
    private pacienteService: PacientesService,
    private institucionService: InstitucionService,
    private areaService: AreasService,
    private conceptoService: ConceptosService,
    private equipoDicomService: EquipoDicomService,
    private medicoService: MedicoService,
    private ordenVentaService: OrdenVentaService
  ) {}

  titulo = "Agendar cita";

  autocompleteControlPaciente = new UntypedFormControl();
  autocompleteControlConvenio = new UntypedFormControl();
  autocompleteControlArea = new UntypedFormControl();
  autocompleteControlConcepto = new UntypedFormControl();
  autocompleteControlMedicoReferente= new UntypedFormControl();


  pacientesFiltrados: Paciente[] = [];
  conveniosFiltrados: Institucion[] = [];
  areasFiltradas: Area[] = [];
  conceptosFiltrados: Concepto[] = [];
  equiposDicom: EquipoDicom[] = [];
  estudios: VentaConceptos[] = [];
  medicosFiltrados: Medico[] = [];

  paciente: Paciente;
  institucion: Institucion;
  area: Area;
  concepto: Concepto;
  equipoDicom: EquipoDicom;
  medicoReferente: Medico;
  ordenVenta: OrdenVenta;

  fecha: String;

  folio: number;

  ngOnInit(): void {

    this.cargarReferenteVacio();
    this.cargarConvenioParticularPorDefecto();

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

    this.autocompleteControlMedicoReferente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombres),
      flatMap(valor => valor ? this.medicoService.filtrarReferentesPorNombre(valor) : [])
    ).subscribe(medicos => this.medicosFiltrados = medicos);

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

  mostrarMedicoReferente(medico ?: Medico): string {
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
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

    event.option.deselect();
    event.option.focus();
  }

  seleccionarMedicoReferente(event): void {
    this.medicoReferente = event.value as Medico;

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

  private reiniciarFormulario() {
    this.limpiarCampos();

    this.paciente = null;
    this.concepto = null;
    this.estudios = [];
    this.ordenVenta = null;
    this.motivo = "";

    this.cargarReferenteVacio();
    this.cargarConvenioParticularPorDefecto();

    this.autocompleteControlPaciente.setValue("");
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

    this.ordenVenta = new OrdenVenta;
    this.ordenVenta.medicoReferente = this.medicoReferente;

    this.ordenVenta.motivo = this.motivo;

    this.ordenVenta.paciente = this.paciente;
    console.log("El paciente en la órden de venta es: ");
    console.log(this.ordenVenta.paciente);


    if(this.institucion.nombre !== 'SALUD PARRAL'){
      this.agendaNormal();
      return;
    }

    this.agendaSaludParral();
  }


  private agendaNormal(): void{
    this.ordenVentaService.venderConceptos(this.estudios, this.ordenVenta).subscribe(
      estudios => {
        this.estudios = estudios;
        this.ordenVenta = this.estudios[0].ordenVenta;
        this.mostrarModalQrImagenes();
        this.reiniciarFormulario();
        Swal.fire("Procesado", "La orden se ha procesado", "success")
      },
      err => {
        console.log(err);
        Swal.fire("Error", "Ha ocurrido un error al procesar la venta", "error")
      }
    );
  }


  private agendaSaludParral(): void{
    this.ordenVentaService.venderConceptosSaludParral(this.estudios, this.ordenVenta, this.folio).subscribe(
      estudios => {
        this.estudios = estudios;
        this.ordenVenta = this.estudios[0].ordenVenta;
        this.mostrarModalQrImagenes();
        this.reiniciarFormulario();
        Swal.fire("Procesado", "La orden se ha procesado", "success")
      },
      err => {
        console.log(err);
        Swal.fire("Error", "Ha ocurrido un error al procesar la venta", "error")
      }
    );
  }


  abrirModalRegistrarPaciente(){
    const modalRef = this.dialog.open(RegistrarPacienteComponent,
      {
        width: "1000px",
        data: {paciente: this.paciente?.id ? this.paciente: null}
      });

      modalRef.afterClosed().subscribe(model =>{

      });
  }


  private cargarReferenteVacio(): void{
    this.medicoService.listar().subscribe(medicos => {
      this.medicosFiltrados = medicos.filter(medico => medico.nombres == "SIN MEDICO REFERENTE");
      this.medicoReferente = this.medicosFiltrados[0];
      this.autocompleteControlMedicoReferente.setValue(this.medicoReferente);
    });
  }

  private cargarConvenioParticularPorDefecto(): void{
    this.institucionService.listar().subscribe(
        instituciones => {
          this.conveniosFiltrados = instituciones.filter(institucion => institucion.nombre === "PARTICULAR");
          this.institucion = this.conveniosFiltrados[0];
          this.autocompleteControlConvenio.setValue(this.institucion);

    });
  }

  private mostrarModalQrImagenes() {
    const modalRef = this.dialog.open(QrSubirFotoOrdenModalComponent,
      {
        width: "300px",
        data: {orden: this.ordenVenta}
      });

      modalRef.afterClosed().subscribe(something =>{console.log(something)});
  }

}



