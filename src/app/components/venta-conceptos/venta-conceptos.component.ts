import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { map, flatMap } from 'rxjs/operators';
import { VIEWER, WEASIS_VIEWER_PATH } from 'src/app/config/app';
import { Area } from 'src/app/models/area';
import { Paciente } from 'src/app/models/paciente';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AreasService } from 'src/app/services/areas.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';
import { CommonListarComponent } from '../common-listar.component';
import { BuscarEstudioModalComponent } from '../studies/buscar-estudio-modal/buscar-estudio-modal.component';
import { EnviarEstudioModalComponent } from '../studies/enviar-estudio-modal/enviar-estudio-modal.component';
import { InformacionEstudioModalComponent } from '../studies/informacion-estudio-modal/informacion-estudio-modal.component';
import { AntecedentesEstudioModalComponent } from './antecedentes-estudio-modal/antecedentes-estudio-modal.component';
import { FechaService } from 'src/app/services/fecha.service';
import { BASE_SITE } from 'src/app/config/app';
import { MatSelect } from '@angular/material/select';
import { EnviarEstudioDicomComponent } from './enviar-estudio-dicom/enviar-estudio-dicom.component';
@Component({
  selector: 'app-venta-conceptos',
  templateUrl: './venta-conceptos.component.html',
  styleUrls: ['./venta-conceptos.component.css'],
})
export class VentaConceptosComponent
  extends CommonListarComponent<VentaConceptos, VentaConceptosService>
  implements OnInit
{
  autocompleteControl = new FormControl();
  autocompleteControlPaciente = new FormControl();
  areasFiltradas: Area[] = [];
  pacientesFiltrados: Paciente[] = [];
  fechaInicio = '';
  fechaFin = '';
  modalidades: string[] = [];
  estudiosOriginales: VentaConceptos[] = [];

  @ViewChild('modalidadSelect') modalidadSelect: MatSelect;

  constructor(
    service: VentaConceptosService,
    @Inject(AreasService) private areasService: AreasService,
    @Inject(PacientesService) private pacienteService: PacientesService,
    private pipe: DatePipe,
    public dialog: MatDialog,
    private fechaService: FechaService
  ) {
    super(service);
    this.titulo = 'Listado de estudios';
    this.nombreModel = 'Estudio';
  }

  override ngOnInit(): void {
    this.buscarEstudiosDeHoy();
    this.buscarModalidades();

    this.autocompleteControl.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        flatMap((valor) =>
          valor ? this.areasService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((areas) => (this.areasFiltradas = areas));

    this.autocompleteControlPaciente.valueChanges
      .pipe(
        map((valor) =>
          typeof valor === 'string' ? valor : valor.nombreCompleto
        ),
        flatMap((valor) =>
          valor ? this.pacienteService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((pacientes) => (this.pacientesFiltrados = pacientes));
  }

  ver(estudio: VentaConceptos): void {
    window.open(`${VIEWER}${estudio.iuid}`);
  }

  abrirWeasis(estudio: VentaConceptos): void {
    window.open(`${WEASIS_VIEWER_PATH}${estudio.iuid}`);
  }

  mostrarNombre(area?: Area): string {
    return area ? area.nombre : '';
  }

  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  buscarEstudiosDeHoy(): any {
    this.service.filtrarDiaDeHoy().subscribe(
      (estudios) => {
        // const filteredList = [];
        // for (let estudio of estudios) {
        //   if (estudio.estado.toUpperCase() !== 'CANCELADO') {
        //     filteredList.push(estudio);
        //   }
        // }
        // this.lista=filteredList

        this.lista = estudios.filter((a) => a.estado !== 'CANCELADO');
        this.estudiosOriginales = [...this.lista];
        this.seleccionarPrimeraModalidad();
      },
      (e) => {
        if (e.status === 404) {
          this.lista = [];
        }
      }
    );
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent): void {
    const area = event.option.value as Area;
    this.lista = [];

    if (this.errorEnFechas()) {
      this.crearRangoDeDosMesesEnBaseAHoy();
    }

    this.service
      .filtrarRangoYArea(this.fechaInicio, this.fechaFin, area.id)
      .subscribe(
        (estudios) => {
          this.lista = estudios.filter((a) => a.estado !== 'CANCELADO');
          this.estudiosOriginales = [...this.lista];
          this.seleccionarPrimeraModalidad();
        },
        (e) => {
          if (e.status === 404) {
            this.lista = [];
          }
        }
      );

    this.autocompleteControl.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    const paciente = event.option.value as Paciente;
    this.lista = [];
    if (this.errorEnFechas()) {
      this.crearRangoDeDosMesesEnBaseAHoy();
    }

    this.service
      .filtrarRangoYPaciente(this.fechaInicio, this.fechaFin, paciente.id)
      .subscribe(
        (estudios) => {
          this.lista = estudios.filter((a) => a.estado !== 'CANCELADO');
          this.estudiosOriginales = [...this.lista];
          this.seleccionarPrimeraModalidad();
        },
        (e) => {
          if (e.status === 404) {
            this.lista = [];
          }
        }
      );

    this.autocompleteControlPaciente.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  private errorEnFechas(): boolean {
    return this.fechaInicio === '' || this.fechaFin === '';
  }

  private crearRangoDeDosMesesEnBaseAHoy(): void {
    this.fechaInicio = this.sumarMesesAFechaDeHoy(-1);
    this.fechaFin = this.sumarMesesAFechaDeHoy(1);
    console.log(this.fechaInicio + ' ' + this.fechaFin);
  }

  private sumarMesesAFechaDeHoy(cantidad: number): string {
    const hoy = new Date(Date.now());
    const sumada = new Date(
      hoy.getFullYear(),
      hoy.getMonth() + cantidad,
      hoy.getDate()
    );
    return this.pipe.transform(sumada, 'yyyy-MM-dd');
  }

  buscarPorFecha(
    fechaInicio: HTMLInputElement,
    fechaFin: HTMLInputElement
  ): void {
    if (fechaInicio.value !== '' && fechaFin.value !== '') {
      this.fechaInicio = this.fechaService.alistarFechaParaBackend(
        fechaInicio.value
      );
      this.fechaFin = this.fechaService.alistarFechaParaBackend(fechaFin.value);

      // console.log(this.fechaInicio + ' ' + this.fechaFin);
      this.lista = [];
      this.service.filtrarRango(this.fechaInicio, this.fechaFin).subscribe(
        (estudios) => {
          this.lista = estudios.filter((a) => a.estado !== 'CANCELADO');
          this.estudiosOriginales = [...this.lista];
          this.seleccionarPrimeraModalidad();
        },
        (e) => {
          if (e.status === 404) {
            this.lista = [];
          }
        }
      );
    } else {
      this.fechaInicio = '';
      this.fechaFin = '';
    }
  }

  buscarEstudioEnPacs(estudio: VentaConceptos): void {
    this.service.buscarEnPacs(estudio.id).subscribe(
      (estudioConIuid) => {
        console.log('Id pacs encontrado en el sistema');
        Swal.fire(
          'Encontrado',
          'Se vinculó el estudio automáticamente',
          'success'
        );
        estudio = estudioConIuid;
      },
      (e) => {
        if (e.status === 404) {
          const modalRef = this.dialog.open(BuscarEstudioModalComponent, {
            width: '1500px',
            data: { estudio: estudio },
          });

          modalRef.afterClosed().subscribe((vinculado) => {
            console.log(vinculado);
            if (vinculado) {
              Swal.fire('Vinculado', 'Se ha vinculado el estudio', 'success');
            }
          });
        }
      }
    );
  }

  abrirEnvio(estudio: VentaConceptos): void {
    const modalRef = this.dialog.open(EnviarEstudioModalComponent, {
      width: '1000px',
      data: { estudio: estudio },
    });

    modalRef.afterClosed().subscribe(
      (enviado) => {
        if (enviado) {
          Swal.fire('Enviado', 'Se ha enviado el estudio con éxito', 'success');
          estudio.estado = enviado.estado;
        }
      },
      (e) => {}
    );
  }

  abrirInformacion(estudio: VentaConceptos): void {
    const modalRef = this.dialog.open(InformacionEstudioModalComponent, {
      width: '1000px',
      data: { estudio: estudio },
    });

    modalRef.afterClosed().subscribe((info) => {});
  }

  abrirAntecedentes(estudio: VentaConceptos): void {
    const modalRef = this.dialog.open(AntecedentesEstudioModalComponent, {
      width: '1000px',
      data: { estudio: estudio },
    });

    modalRef.afterClosed().subscribe((info) => {});
  }

  abrirQr(estudio: VentaConceptos) {
    this.service.verEtiqueta(estudio.id).subscribe((res) => {
      console.log(res);
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  desvincular(estudio: VentaConceptos) {
    if (estudio.estado === 'INTERPRETADO') {
      Swal.fire({
        icon: 'error',
        title: 'No se puede desvincular',
        text: `el estudio de ${estudio.paciente.nombre} ya esta interpretado.`,
        background: 'black',
        toast: true,
        color: 'white',
        confirmButtonText: 'Cerrar',
        position: 'bottom-end'
      });
      return;
    }
    Swal.fire({
      title: '¿Desea desvincular el estudio?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Éxito', 'El estudio ha sido desvinculado', 'success');
        estudio.iuid = '';
        this.actualizarEstudio(estudio);
      }
    });
  }

  seleccionarModalidad(event) {
    const modalidad = event.value as string;
    if (modalidad === 'TODAS') {
      this.lista = [...this.estudiosOriginales];
    } else {
      this.filtrarPorModalidad(modalidad);
    }
  }

  actualizarEstudio(estudio: VentaConceptos) {
    this.service.editar(estudio).subscribe(
      (actualizado) => {
        console.log('Actualizado');
      },
      (error) => {
        Swal.fire(
          'Error',
          'Ocurrió un error al desvincular\nVuelva a intentarlo',
          'error'
        );
      }
    );
  }

  verMasInfo(estudio: VentaConceptos) {
    estudio.verMasInfo = !estudio.verMasInfo;
  }

  verQr(estudio: VentaConceptos): void {
    let ordenVentaId = estudio.ordenVenta.id;
    let pacienteId = estudio.paciente.id;
    let url = `${BASE_SITE}/resultados/orden/${ordenVentaId}/${pacienteId}`;
    window.location.href = url;
  }

  private buscarModalidades() {
    this.areasService.listar().subscribe((areas) => {
      this.modalidades = areas
        .map((a) => a.nombre)
        .filter((a) => this.esModalidad(a));
      this.modalidades.unshift('TODAS');
    });
  }

  private esModalidad(nombre: string): boolean {
    if (nombre == 'ANESTESIA') {
      return false;
    }
    if (nombre == 'DIAGNOKINES') {
      return false;
    }
    if (nombre == 'IMPRESION') {
      return false;
    }
    if (nombre == 'PAQUETES') {
      return false;
    }
    if (nombre == 'TAC COVID') {
      return false;
    }
    return true;
  }

  private filtrarPorModalidad(modalidad: string) {
    this.lista = this.estudiosOriginales.filter(
      (estudio) => estudio.concepto.area.nombre == modalidad
    );
  }

  private seleccionarPrimeraModalidad() {
    const primeraModalidad = this.modalidades[0];
    this.modalidadSelect.value = primeraModalidad;
    this.modalidadSelect.valueChange.emit(primeraModalidad); // Emitir el cambio si es necesario
  }
  enviar(estudio: VentaConceptos): void {
    this.service.procesarEstudioEnWorklist(estudio.id).subscribe(
      () => {
        estudio.enWorklist = true;
        Swal.fire('Éxito', 'Procesado correctamente', 'success');
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'No se ha podido procesar la worklist', 'error');
      }
    );
  }

  abrirEnvioDicom(estudio) {
    const modalRef = this.dialog.open(EnviarEstudioDicomComponent, {
      width: '1000px',
      data: { estudio: estudio },
    });

    modalRef.afterClosed().subscribe((info) => {});
  }
}
