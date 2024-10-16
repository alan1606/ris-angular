import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  MatAutocompleteSelectedEvent,
  MatDialog,
  Campania,
  DataService,
  CampaniaService,
  Area,
  Concepto,
  EquipoDicom,
  Institucion,
  OrdenVenta,
  OrdenVentaService,
  Paciente,
  VentaConceptos,
  AreasService,
  ConceptosService,
  EquipoDicomService,
  InstitucionService,
  PacientesService,
  Swal,
  DatePipe,
  Cita,
  CitaService,
  RegistrarPacienteParcialModalComponent,
  FechaService,
  MostrarCitasPorDiaPensionesComponent,
  InstruccionesService,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
  Pago,
  Descuento,
} from './index';
import { QrSubirFotoOrdenModalComponent } from '../qr-subir-foto-orden-modal/qr-subir-foto-orden-modal.component';
import { RegistrarPacienteComponent } from '../registrar-paciente-modal/registrar-paciente.component';
import { LimitarInstitucionPorSalaService } from 'src/app/horarios/services/limitar-institucion-por-sala.service';
import { firstValueFrom } from 'rxjs';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { Canal } from 'src/app/models/canal';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css'],
})
export class AgendarComponent implements OnInit {
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
    private fechaService: FechaService,
    private instruccionesService: InstruccionesService,
    private dataService: DataService,
    private limiteService: LimitarInstitucionPorSalaService,
    private alertaService: AlertaService
  ) {
    this.formulario = this.fb.group({
      salaControl: new FormControl(''),
      citaControl: new FormControl(''),
    });

    this.minDate = new Date();
  }

  total: number;
  motivo: string;
  codigoPromocion: string = '';
  formulario: FormGroup;
  instrucciones: string = '';
  private instruccionesInstitucion = '';
  isUrgencia: boolean = false;
  titulo = 'Agendar cita';
  origen: string = 'agendar';
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
  paciente: Paciente = new Paciente();
  institucion: Institucion;
  area: Area;
  concepto: Concepto;
  espaciosAgenda: number;
  equipoDicom: EquipoDicom;
  ordenVenta: OrdenVenta;
  fecha: string;
  campania: Campania = new Campania();
  isCodigoPromocionalDisabled: boolean = false;
  minDate: Date;
  botonHabilitado: boolean = false;
  seleccionarUrgencia: boolean = true;
  deshabilitarUrgencias: boolean = false;
  pagoRecibido: boolean = false;
  pagos: Pago[] = [];
  descuentos: Descuento[] = [];
  date: FormControl = new FormControl(new Date());

  hayQueSeleccionarCampania: boolean = false;
  campaniaSeleccionada: Campania;
  canalSeleccionado: Canal;
  campaniasEncontradas: Campania[] = [];

  ngOnInit(): void {
    this.cargarConvenioParticularPorDefecto();

    this.hayQueSeleccionarCampania = false;
    this.campaniaSeleccionada = null;
    this.canalSeleccionado = null;

    this.autocompleteControlPaciente.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((valor) => {
          const nombreCompleto =
            typeof valor === 'string' ? valor : valor.nombreCompleto;
          return valor
            ? this.pacienteService.filtrarPorNombre(nombreCompleto)
            : [];
        }),
        catchError((error) => {
          console.error('Error en la búsqueda de pacientes:', error);
          return [];
        })
      )
      .subscribe((pacientes) => {
        this.pacientesFiltrados = pacientes;
      });

    this.autocompleteControlConvenio.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        mergeMap((valor) =>
          valor ? this.institucionService.buscarLikeNombre(valor) : []
        )
      )
      .subscribe((instituciones) => (this.conveniosFiltrados = instituciones));

    this.autocompleteControlConcepto.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.concepto)),
        mergeMap((valor) =>
          valor && this.area?.id
            ? this.conceptoService.buscarLikeNombreEnArea(valor, this.area.id)
            : []
        )
      )
      .subscribe((conceptos) => {
        this.conceptosFiltrados = conceptos;
      });

    this.autocompleteControlArea.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        mergeMap((valor) =>
          valor ? this.areaService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((areas) => {
        this.areasFiltradas = areas;
        this.autocompleteControlConcepto.setValue('');
        this.conceptosFiltrados = [];
        this.concepto = null;
      });

    this.formulario
      .get('salaControl')
      .valueChanges.subscribe((value: number) => {
        console.log(value);
        if (!value) {
          return;
        }
        this.equipoDicomService.ver(value).subscribe(
          (sala) => {
            this.equipoDicom = sala;
            this.citas = [];
            this.formulario.get('citaControl').setValue('');
            if (this.fecha && !this.isUrgencia) {
              this.cargarCitas();
            }
          },
          (err) => console.log(err)
        );
      });

    this.formulario.get('citaControl').valueChanges.subscribe((value) => {
      if (value) {
        this.cita = value;
        this.concepto.espaciosAgenda = this.espaciosAgenda;
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
    this.mostrarInstruccionesInstitucion(this.institucion);
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
    let c = event.option.value as Concepto;
    if (!this.isUrgencia && this.estudios.length >= 0) {
      for (let e of this.estudios) {
        if (e.concepto.id === c.id) {
          Swal.fire({
            icon: 'error',
            title: 'Estudio duplicado',
            text: 'En lugar de seleccionar nuevamente el estudio, asigne más espacios al original.',
          });
          this.autocompleteControlConcepto.setValue(null);
          console.log('Entro el if y deberia hacer return');
          return;
        }
      }
    }
    console.log('Seleccionando concepto');
    this.concepto = c;

    this.conceptoService.ver(this.concepto.id).subscribe((concepto) => {
      this.concepto = concepto;
      this.espaciosAgenda = concepto.espaciosAgenda;
    });
  }

  seleccionarEquipoDicom(event): void {
    this.equipoDicom = event.value as EquipoDicom;
    event.option.deselect();
    event.option.focus();
  }

  private cargarEquiposDicom(): void {
    this.equipoDicomService
      .filtrarPorArea(this.area.id)
      .subscribe((equipos) => {
        this.equiposDicom = equipos;
      });
  }

  recibirPagos(event: Pago[]): void {
    this.pagos = event;
    this.pagoRecibido = true;
  }
  recibirDescuentos(event: Descuento[]): void {
    this.descuentos = event;
  }

  cambioPagosDescuentos(event): void {
    this.pagoRecibido = false;
  }

  agregarEstudio(citas: Cita[]) {
    const estudio = new VentaConceptos();
    estudio.concepto = this.concepto;
    estudio.enWorklist = false;
    estudio.equipoDicom = this.equipoDicom;
    estudio.paciente = this.paciente;
    estudio.citas = citas;
    this.estudios.push(estudio);

    this.calcularTotal();
    this.mostrarInstruccionesConcepto(
      this.estudios[this.estudios.length - 1].concepto
    );
    this.limpiarCampos();
  }

  agregarEstudioUrgencias(): void {
    if (!this.area) {
      return;
    }
    if (!this.concepto) {
      return;
    }
    if (!this.paciente.id) {
      return;
    }
    this.deshabilitarUrgencias = true;
    this.origen = 'urgencias';
    const estudio = new VentaConceptos();
    estudio.concepto = this.concepto;
    estudio.enWorklist = false;
    estudio.equipoDicom = this.equipoDicom;
    estudio.paciente = this.paciente;
    this.estudios.push(estudio);
    this.calcularTotal();
    this.limpiarCampos();
  }

  private apartarCita(cita: Cita) {
    if (!this.datosValidos()) {
      return;
    }
    console.log('Espacios seleccionados: ', this.concepto.espaciosAgenda);
    this.citaService
      .apartarCitaEspacios(cita.id, this.concepto.espaciosAgenda)
      .subscribe(
        (citas) => {
          console.log('Espacios apartados: ', citas);
          this.agregarEstudio(citas);
          //tengo que hacer esto por todas las citas
          this.citas = this.citas.filter((cita) => cita.id != this.cita.id);
        },
        (error) => {
          Swal.fire('Error', error.error.detail, 'error');
        }
      );
  }

  private limpiarCampos(): void {
    this.area = null;
    this.concepto = null;
    this.equipoDicom = null;
    this.equiposDicom = [];
    this.citas = [];
    this.espaciosAgenda = 0;

    this.autocompleteControlArea.setValue('');
    this.autocompleteControlConcepto.setValue('');
    this.formulario.get('citaControl').setValue('');
    this.formulario.get('salaControl').setValue('');
  }

  private reiniciarFormulario() {
    this.limpiarCampos();

    this.paciente = new Paciente();
    this.concepto = new Concepto();
    this.estudios = [];
    this.ordenVenta = new OrdenVenta();
    this.motivo = '';
    this.campania = new Campania();
    this.codigoPromocion = '';
    this.pagoRecibido = false;
    this.botonHabilitado = false;
    this.instrucciones = '';
    this.instruccionesInstitucion = '';
    this.isUrgencia = false;
    this.seleccionarUrgencia = true;
    this.deshabilitarUrgencias = false;
    this.cargarConvenioParticularPorDefecto();
    this.origen = 'agendar';

    this.autocompleteControlPaciente.setValue('');
    this.isCodigoPromocionalDisabled = false;
  }

  private datosValidos(): boolean {
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

  quitarEstudio(i: number, j: number): void {
    this.liberarCita(this.estudios[i].citas[j]);
    this.estudios[i].citas.splice(j, 1);
    this.calcularTotal();
    if (this.estudios[i].citas.length == 0) {
      this.estudios.splice(i, 1);
      this.mostrarInstruccionesGenerales();
      this.seleccionarUrgencia = true;
    }
  }

  quitarEstudioUrgencia(event: VentaConceptos): void {
    this.estudios = this.estudios.filter((e) => e !== event);
    this.calcularTotal();
    if (this.estudios.length === 0) {
      this.seleccionarUrgencia = true;
      this.deshabilitarUrgencias = false;
      this.pagoRecibido = false;
      this.origen = 'agendar';
    }
  }

  private liberarCita(cita: Cita) {
    this.citaService.liberarCita(cita.id).subscribe(
      () => {},
      (error) => console.log(error)
    );
  }

  agendar() {
    console.log('Fecha de nacimiento: ', this.paciente.fechaNacimiento);
    if (this.isUrgencia) {
      if (this.paciente.fechaNacimiento) {
        let patientYear = '';
        try {
          let [p] = this.paciente.fechaNacimiento.split('-');
          patientYear = p;
        } catch (error) {
          console.log("Error en el catch")
          this.alertaService.info(
            'No se puede comprobar la edad',
            'Verifique la fecha de nacimiento del paciente'
          );
          return;
        }
        let actualYear: number = new Date().getFullYear();
        let patientAge: number = actualYear - parseInt(patientYear);
        if (patientAge >= 120) {
          this.alertaService.info(
            'Mayor de 120 años',
            'El paciente tiene mas de 120 años y puede provocar errores en los equipos',
            false,
            true,
            'Volver'
          );
          return;
        }
        if (patientAge < 0) {
          this.alertaService.info(
            'Menor de 0 años',
            'El paciente aun no nace no se pude proseguir',
            false,
            true,
            'Volver'
          );
          return;
        }
      } else {
        this.alertaService.info(
          'El paciente no tiene fecha de nacimiento',
          'Porfavor corriga la fecha de nacimiento del paciente'
        );
        return;
      }
      
      if (this.institucion.nombre != 'PARTICULAR') {
        this.procesarVenta();
        return;
      }

      if (
        this.hayQueSeleccionarCampania &&
        this.campaniaSeleccionada &&
        this.canalSeleccionado
      ) {
        this.procesarVenta();
        return;
      }

      if (
        this.hayQueSeleccionarCampania &&
        (!this.campaniaSeleccionada || !this.canalSeleccionado)
      ) {
        this.alertaService.campoInvalido(
          'Pregunte al paciente',
          'Por favor, preguntar al paciente de qué canal supo de la promoción'
        );
        return;
      }

      //Hacer petición para saber si hay promoción para esos estudios
      this.campaniasService
        .obtenerCampaniasActivasPorConceptos(
          this.estudios.map((e) => e.concepto.id)
        )
        .subscribe(
          (campanias) => {
            if (campanias.length > 0) {
              this.hayQueSeleccionarCampania = true;

              //Darle a seleccionar la campaña entre las campañas encontradas
              this.campaniasEncontradas = campanias;
              this.alertaService.campoInvalido(
                'Seleccionar promoción',
                'Favor de seleccionar la promoción a aplicar'
              );
            } else {
              this.procesarVenta();
            }
          },
          (err) => {
            console.error(err);
            this.procesarVenta();
          }
        );
    } else {
      this.procesarVenta();
    }
  }

  private procesarVenta() {
    this.botonHabilitado = true;
    Swal.fire({
      title: 'Procesando',
      icon: 'info',
      text: 'Espere mientras termina el proceso',
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    setTimeout(() => {
      if (!this.isUrgencia) {
        this.pagos = [];
        this.descuentos = [];
      }
      this.ordenVenta = new OrdenVenta();
      this.ordenVenta.paciente = this.paciente;
      this.ordenVenta.pagos = this.pagos;
      this.ordenVenta.descuentos = this.descuentos;
      if (this.campania.id) {
        this.ordenVenta.aplicarDescuento = true;
        this.ordenVenta.codigoPromocional = this.campania.codigo;
      }
      this.agendaNormal();
      Swal.close();
    }, 2000);
  }

  private agendaNormal(): void {
    for (let estudio of this.estudios) {
      estudio.institucion = this.institucion;
    }
    this.ordenVenta.estudiosList = this.estudios;
    this.ordenVentaService
      .venderConceptos(this.ordenVenta, this.origen)
      .subscribe(
        (estudios) => {
          this.estudios = estudios;
          this.ordenVenta = this.estudios[0].ordenVenta;
          if (
            this.hayQueSeleccionarCampania &&
            this.campaniaSeleccionada &&
            this.canalSeleccionado
          ) {
            this.canjearPromocion({ ...this.ordenVenta });
          }
          this.mostrarModalQrImagenes();
          this.reiniciarFormulario();
          Swal.fire('Procesado', 'La orden se ha procesado', 'success');
        },
        (err) => {
          console.log(err);
          Swal.fire(
            'Error',
            'Ha ocurrido un error al procesar la venta',
            'error'
          );
          this.reiniciarFormulario();
        }
      );
  }

  public abrirModalRegistrarPacienteParcial() {
    if (!this.isUrgencia) {
      const modalRef = this.dialog.open(
        RegistrarPacienteParcialModalComponent,
        {
          width: '1000px',
          data: { paciente: this.paciente?.id ? this.paciente : null },
        }
      );

      modalRef.afterClosed().subscribe((paciente) => {
        if (paciente) {
          this.paciente = paciente;
          this.autocompleteControlPaciente.setValue(this.paciente);
        }
      });
    } else if (this.isUrgencia) {
      const modalRef = this.dialog.open(RegistrarPacienteComponent, {
        width: '1000px',
        data: { paciente: this.paciente?.id ? this.paciente : null },
      });

      modalRef.afterClosed().subscribe((paciente) => {
        console.log(paciente);
        if (paciente) {
          this.paciente = paciente;
          this.autocompleteControlPaciente.setValue(this.paciente);
        }
      });
    } else {
      return;
    }
  }

  private cargarConvenioParticularPorDefecto(): void {
    this.institucionService.listar().subscribe((instituciones) => {
      this.conveniosFiltrados = instituciones.filter(
        (institucion) => institucion.nombre === 'PARTICULAR'
      );
      this.institucion = this.conveniosFiltrados[0];
      this.autocompleteControlConvenio.setValue(this.institucion);
    });
  }

  buscarCodigoPromocional(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.codigoPromocion) {
      this.campaniasService.buscarPorCodigo(this.codigoPromocion).subscribe(
        (campania) => {
          this.campania = campania;
          this.simularDescuento();
          this.isCodigoPromocionalDisabled = true;
          Swal.fire(
            'Aplicado',
            `Campania ${campania.nombre} aplicada con éxito: ${campania.descripcion}`,
            'success'
          );
        },
        () => {
          Swal.fire(
            'No encontrado',
            'No se ha podido encontrar la campaña',
            'error'
          );
        }
      );
    }
  }
  private mostrarModalQrImagenes() {
    const modalRef = this.dialog.open(QrSubirFotoOrdenModalComponent, {
      data: { orden: this.ordenVenta },
    });

    modalRef.afterClosed().subscribe((something) => {
      console.log(something);
    });
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
    if (this.institucion.id !== 1) {
      this.total = total;
      this.dataService.actualizarPrecio(this.total);
      return;
    }
    this.estudios.forEach((estudio) => (total += estudio.concepto.precio));

    this.total = total;
    this.dataService.actualizarPrecio(this.total);
  }

  public actualizarFecha(fecha: HTMLInputElement): void {
    let fechaBackend = this.fechaService.alistarFechaParaBackend(fecha.value);
    let fechaDiferente = false;

    if (this.estudios.length > 0) {
      this.estudios[0].citas.forEach((cita) => {
        let [f] = cita.fechaYHora.split('T');
        if (fechaBackend !== f) {
          Swal.fire({
            icon: 'error',
            title: 'Estudios en diferentes fechas',
            text: 'Solo se pueden agendar estudios con las mismas fechas.',
          });
          fechaDiferente = true;
          return;
        }
      });
      if (fechaDiferente) {
        this.date = new FormControl(new Date());
        return;
      }
    }

    this.fecha = fechaBackend;
    this.seleccionarUrgencia = false;
    this.cargarCitas();
  }

  private async cargarCitas(): Promise<void> {
    // Con esto verifico si modificaron los espacios de la agenda por defecto. Para que pongan los espacios que quieran
    if (
      this.espaciosAgenda &&
      this.concepto.espaciosAgenda != this.espaciosAgenda
    ) {
      this.concepto.espaciosAgenda = this.espaciosAgenda;
    }

    if (this.hayQueMostrarLimiteUltrasonido()) {
      this.mostrarCitasUltrasonido();
    }

    // Aquí esperamos la respuesta de limiteInstitucionSuperado antes de continuar
    const limiteSuperado = await this.limiteInstitucionSuperado();
    if (limiteSuperado) {
      Swal.fire(
        'Límite',
        'No es posible agendar más estudios en la institución',
        'error'
      );
      return;
      // No quiero que se ejecute el código que viene del citaService
    }

    this.citaService
      .obtenerDisponiblesPorSalaYFechaEspacios(
        this.equipoDicom.id,
        this.fecha,
        this.concepto.espaciosAgenda
      )
      .subscribe(
        (citas) => {
          this.citas = citas;
        },
        (error) => {
          Swal.fire('No hay citas', error.error.detail, 'info');
          this.citas = [];
          this.cita = null;
          console.log(error);
        }
      );
  }

  private async limiteInstitucionSuperado(): Promise<boolean> {
    try {
      const superado = await firstValueFrom(
        this.limiteService.limiteSuperadoInstitucionSalaFecha(
          this.institucion.id,
          this.equipoDicom.id,
          this.fecha
        )
      );
      return superado;
    } catch (error) {
      console.error('Ocurrió un error encontrando el límite', error);
      return false;
    }
  }

  private hayQueMostrarLimiteUltrasonido(): boolean {
    if (this.area.nombre == 'ULTRASONIDO') {
      return true;
    }
    return false;
  }

  private mostrarCitasUltrasonido() {
    this.dialog.open(MostrarCitasPorDiaPensionesComponent, {
      data: {
        dia: this.fecha,
        salaId: this.equipoDicom.id,
        institucionId: this.institucion.id,
      },
    });
  }

  limpiarPaciente(): void {
    this.paciente = null;
    this.autocompleteControlPaciente.setValue('');
  }

  private mostrarInstruccionesArea(area: Area): void {
    this.instruccionesService.buscarPorArea(area.id).subscribe(
      (inst) => {
        area.instrucciones = inst.instrucciones;
        this.mostrarInstruccionesGenerales();
      },
      (err) => {
        this.area.instrucciones = '';
        this.mostrarInstruccionesGenerales();
      }
    );
  }

  private mostrarInstruccionesInstitucion(institucion: Institucion): void {
    this.instruccionesService.buscarPorInstitucion(institucion.id).subscribe(
      (inst) => {
        this.instruccionesInstitucion = inst.instrucciones;
        this.mostrarInstruccionesGenerales();
      },
      (err) => {
        this.instruccionesInstitucion = '';
        this.mostrarInstruccionesGenerales();
      }
    );
  }

  private mostrarInstruccionesConcepto(concepto: Concepto): void {
    this.mostrarInstruccionesArea(concepto.area);

    this.instruccionesService.buscarPorConcepto(concepto.id).subscribe(
      (inst) => {
        concepto.instrucciones = inst?.instrucciones;
        this.mostrarInstruccionesGenerales();
      },
      (err) => {
        this.concepto.instrucciones = '';
        this.mostrarInstruccionesGenerales();
      }
    );
  }

  private mostrarInstruccionesGenerales() {
    //Obtener instrucciones de área
    this.instrucciones = '';
    for (let i = 0; i < this.estudios.length; i++) {
      if (this.estudios[i].concepto?.instrucciones) {
        this.instrucciones =
          this.instrucciones + this.instrucciones
            ? this.instrucciones +
              '; ' +
              this.estudios[i].concepto.instrucciones
            : this.estudios[i].concepto.instrucciones;
      }
      if (this.estudios[i].concepto?.area?.instrucciones) {
        this.instrucciones =
          this.instrucciones + this.instrucciones
            ? this.instrucciones +
              '; ' +
              this.estudios[i].concepto.area.instrucciones
            : this.estudios[i].concepto.area.instrucciones;
      }
    }
    if (this.instruccionesInstitucion) {
      this.instrucciones =
        this.instrucciones + this.instrucciones
          ? this.instrucciones + '; ' + this.instruccionesInstitucion
          : this.instruccionesInstitucion;
    }
  }

  private canjearPromocion(orden: OrdenVenta) {
    orden.idCanal = this.canalSeleccionado.id;
    orden.codigoPromocional = this.campaniaSeleccionada.codigo;
    console.log('canjeando orden ', orden);
    this.campaniasService.registrarCampaniaOrden(orden).subscribe(
      (campaniaOrdenRetornada) => {
        console.log('Campaña canjeada con éxito ', campaniaOrdenRetornada);
        this.limpiarCuestionCampañas();
      },
      (error) => {
        console.error('Error al canjear campaña ', error);
        this.limpiarCuestionCampañas();
      }
    );
  }

  private limpiarCuestionCampañas() {
    this.hayQueSeleccionarCampania = false;
    this.campaniaSeleccionada = null;
    this.canalSeleccionado = null;
    this.campaniasEncontradas = [];
  }
}
