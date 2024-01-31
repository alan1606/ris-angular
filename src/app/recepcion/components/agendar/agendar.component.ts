import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { catchError, debounceTime, distinctUntilChanged, map, mergeMap, switchMap } from 'rxjs';
import { Campania } from 'src/app/campanias/models/campania';
import { CampaniaService } from 'src/app/campanias/services/campania.service';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { Institucion } from 'src/app/models/institucion';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Paciente } from 'src/app/models/paciente';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AreasService } from 'src/app/services/areas.service';
import { ConceptosService } from 'src/app/services/conceptos.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Cita } from 'src/app/models/cita';
import { CitaService } from 'src/app/services/cita.service';
import { RegistrarPacienteParcialModalComponent } from '../registrar-paciente-parcial-modal/registrar-paciente-parcial-modal.component';
import { FechaService } from 'src/app/services/fecha.service';
import { MostrarCitasPorDiaPensionesComponent } from '../mostrar-citas-por-dia-pensiones/mostrar-citas-por-dia-pensiones.component';


@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css']
})
export class AgendarComponent implements OnInit {

  total: number;
  motivo: string;
  codigoPromocion: string = "";
  botonDeshabilitar:boolean=false;
  formulario: FormGroup;

  constructor(
    private pipe: DatePipe,
    private dialog: MatDialog,
    private pacienteService: PacientesService,
    private institucionService: InstitucionService,
    private areaService: AreasService,
    private conceptoService: ConceptosService,
    private equipoDicomService: EquipoDicomService,
    private ordenVentaService: OrdenVentaService,
    private campaniasService: CampaniaService,
    private citaService: CitaService,
    private fb: FormBuilder,
    private fechaService: FechaService
  ) {
    this.formulario = this.fb.group({
      salaControl: new FormControl(''),
      citaControl: new FormControl('')
    });

    this.minDate = new Date();

  }

  titulo = "Agendar cita";

  autocompleteControlPaciente = new UntypedFormControl();
  autocompleteControlConvenio = new UntypedFormControl();
  autocompleteControlArea = new UntypedFormControl();
  autocompleteControlConcepto = new UntypedFormControl();
  autocompleteControlMedicoReferente = new UntypedFormControl();


  pacientesFiltrados: Paciente[] = [];
  conveniosFiltrados: Institucion[] = [];
  areasFiltradas: Area[] = [];
  conceptosFiltrados: Concepto[] = [];
  equiposDicom: EquipoDicom[] = [];
  estudios: VentaConceptos[] = [];
  citas: Cita[] = [];
  cita: Cita;

  paciente: Paciente;
  institucion: Institucion;
  area: Area;
  concepto: Concepto;
  equipoDicom: EquipoDicom;
  ordenVenta: OrdenVenta;

  fecha: string;

  campania: Campania = new Campania();

  isCodigoPromocionalDisabled: boolean = false;

  minDate: Date;

  ngOnInit(): void {

    this.cargarConvenioParticularPorDefecto();

    this.autocompleteControlPaciente.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap(valor => {
        const nombreCompleto = typeof valor === 'string' ? valor : valor.nombreCompleto;
        return valor ? this.pacienteService.filtrarPorNombre(nombreCompleto) : [];
      }),
      catchError(error => {
        console.error('Error en la búsqueda de pacientes:', error);
        return [];
      })
    ).subscribe(pacientes => {
      this.pacientesFiltrados = pacientes;
    });

    this.autocompleteControlConvenio.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.institucionService.buscarLikeNombre(valor) : [])
    ).subscribe(instituciones => this.conveniosFiltrados = instituciones);

    this.autocompleteControlConcepto.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.concepto),
      mergeMap(valor => valor && this.area?.id ? this.conceptoService.buscarLikeNombreEnArea(valor, this.area.id) : [])
    ).subscribe(conceptos => {
      this.conceptosFiltrados = conceptos;
    });

    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areaService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => {
      this.areasFiltradas = areas;
      this.autocompleteControlConcepto.setValue("");
      this.conceptosFiltrados = [];
      this.concepto = null;
    });

    this.formulario.get('salaControl').valueChanges.subscribe(value => {
      this.equipoDicomService.ver(value).subscribe(sala => {
        this.equipoDicom = sala;
        this.citas = [];
        this.formulario.get('citaControl').setValue('');
      },
        err => console.log(err));
    });

    this.formulario.get('citaControl').valueChanges.subscribe(value => {
      if(value){
        this.cita = value;
        this.apartarCita(this.cita);
      }
     
    });

    this.fecha = this.pipe.transform(new Date(), 'yyyy-MM-dd');

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

  mostrarNombreConcepto(concepto?: Concepto): string {
    return concepto ? concepto.concepto : '';
  }

  seleccionarInstitucion(event: MatAutocompleteSelectedEvent) {
    this.institucion = event.option.value as Institucion;
    event.option.deselect();
    event.option.focus();
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent) {
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

    this.conceptoService.ver(this.concepto.id).subscribe(concepto => this.concepto = concepto);
    event.option.deselect();
    event.option.focus();
  }

  seleccionarEquipoDicom(event): void {
    this.equipoDicom = event.value as EquipoDicom;

    event.option.deselect();
    event.option.focus();
  }


  private cargarEquiposDicom(): void {
    this.equipoDicomService.filtrarPorArea(this.area.id).subscribe(
      equipos => {
        this.equiposDicom = equipos;
      }
    );
  }

   agregarEstudio() {

    const estudio = new VentaConceptos();

    estudio.concepto = this.concepto;
    estudio.enWorklist = false;
    estudio.equipoDicom = this.equipoDicom;
    estudio.paciente = this.paciente;
    estudio.cita = this.cita;


    this.estudios.push(estudio);

    this.calcularTotal();

    this.limpiarCampos();
  }

  private apartarCita(cita: Cita) {
    if (!this.datosValidos()) {
      return;
    }
    this.citaService.apartarCita(cita.id).subscribe(() => {
      this.agregarEstudio();
    },
    (error) => {
      Swal.fire("Error", error.error.detail, "error");
    });
    this.citas = this.citas.filter(cita => cita.id != this.cita.id);

  }



  private limpiarCampos(): void {
    this.area = null;
    this.concepto = null;
    this.equipoDicom = null;
    this.equiposDicom = [];
    this.citas = [];

    this.autocompleteControlArea.setValue("");
    this.autocompleteControlConcepto.setValue("");
    this.formulario.get('citaControl').setValue("");
    this.formulario.get('salaControl').setValue("");
  }

  private reiniciarFormulario() {
    this.limpiarCampos();

    this.paciente = new Paciente();
    this.concepto = new Concepto();
    this.estudios = [];
    this.ordenVenta = new OrdenVenta();
    this.motivo = "";
    this.campania = new Campania();
    this.codigoPromocion = '';
    this.botonDeshabilitar=false;

    this.cargarConvenioParticularPorDefecto();

    this.autocompleteControlPaciente.setValue("");
    this.isCodigoPromocionalDisabled = false;
  }

  datosValidos(): boolean {
    if (this.cita == null) {
      return false;
    }
    if (this.area == null) {
      return false;
    }
    if (this.estudios == null) {
      return false;
    }
    if (this.equipoDicom == null) {
      return false;
    }
    return true;
  }

  quitarEstudio(i: number): void {
    this.liberarCita(this.estudios[i].cita);
    this.estudios.splice(i, 1);
    this.calcularTotal();
  }

  private liberarCita(cita: Cita) {
    this.citaService.liberarCita(cita.id).subscribe(()=>{},
    error => console.log(error));
  }

  agendar() {

    this.botonDeshabilitar=true;
    
    setTimeout(()=>{
      this.ordenVenta = new OrdenVenta;


      this.ordenVenta.paciente = this.paciente;
      console.log(this.ordenVenta.paciente);
  
      if (this.campania.id) {
        this.ordenVenta.aplicarDescuento = true;
        this.ordenVenta.codigoPromocional = this.campania.codigo;
      }
      this.total = 0;
      this.agendaNormal();

    },2000);
  }


  private agendaNormal(): void {
    for(let estudio of this.estudios){
      estudio.institucion = this.institucion;
    }

    this.ordenVentaService.venderConceptos(this.estudios, this.ordenVenta).subscribe(
      estudios => {
        this.estudios = estudios;
        this.ordenVenta = this.estudios[0].ordenVenta;
        this.reiniciarFormulario();
        Swal.fire("Procesado", "La orden se ha procesado", "success")
      },
      err => {
        console.log(err);
        Swal.fire("Error", "Ha ocurrido un error al procesar la venta", "error")
      }
    );
  }



  abrirModalRegistrarPacienteParcial() {
    
    const modalRef = this.dialog.open(RegistrarPacienteParcialModalComponent,
      {
        width: "1000px",
        data: { paciente: this.paciente?.id ? this.paciente : null }
      });

    modalRef.afterClosed().subscribe(paciente => {
      if(paciente){
        this.paciente = paciente;
        this.autocompleteControlPaciente.setValue(this.paciente);
      }
    });
  }



  private cargarConvenioParticularPorDefecto(): void {
    this.institucionService.listar().subscribe(
      instituciones => {
        this.conveniosFiltrados = instituciones.filter(institucion => institucion.nombre === "PARTICULAR");
        this.institucion = this.conveniosFiltrados[0];
        this.autocompleteControlConvenio.setValue(this.institucion);

      });
  }


  buscarCodigoPromocional(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.codigoPromocion) {
      this.campaniasService.buscarPorCodigo(this.codigoPromocion).subscribe(
        campania => {
          this.campania = campania;
          this.simularDescuento();
          this.isCodigoPromocionalDisabled = true;
          Swal.fire("Aplicado", `Campania ${campania.nombre} aplicada con éxito: ${campania.descripcion}`, "success");
        },
        () => {
          Swal.fire("No encontrado", "No se ha podido encontrar la campaña", "error");
        }
      );
    }
  }


  private simularDescuento(): void {
    for (let i = 0; i < this.campania.conceptos.length; i++) {
      let concepto = this.campania.conceptos[i];
      this.aplicarDescuento(concepto);
    }
    this.calcularTotal();
  }

  private aplicarDescuento(concepto: Concepto) {
    for (let i = 0; i < this.estudios.length; i++) {
      if (this.estudios[i].concepto.id == concepto.id) {
        this.estudios[i].concepto.precio = concepto.precioDespuesDescuento;
      }
    }
  }

  private calcularTotal() {
    let total: number = 0;
    this.estudios.forEach(estudio => total += estudio.concepto.precio);

    this.total = total;
  }


  public actualizarFecha(fecha: HTMLInputElement) {
    this.fecha = this.fechaService.alistarFechaParaBackend(fecha.value);

    this.citaService.obtenerDisponiblesPorSalaYFecha(this.equipoDicom.id, this.fecha).subscribe(citas => {
      this.citas = citas;
      if(this.hayQueMostrarLimitePensionesUltrasonido()){
        this.mostrarCitasPensionesUltrasonido();
      }
    },
      error => {
        Swal.fire("No hay citas", error.error.detail, "info");
        this.citas = [];
        this.cita = null;
        console.log(error);
      });
  };


  private hayQueMostrarLimitePensionesUltrasonido(): boolean {
    if(this.institucion.nombre === "PENSIONES" && this.area.nombre == "ULTRASONIDO"){
      return true;
    }
    return false;
  }

  private mostrarCitasPensionesUltrasonido() {
    this.dialog.open(MostrarCitasPorDiaPensionesComponent, {
      data: {dia: this.fecha, salaId: this.equipoDicom.id},
    });
  }

  limpiarPaciente(): void{
    this.paciente = null;
    this.autocompleteControlPaciente.setValue("");
  }
}
