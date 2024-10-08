import { DatePipe } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Cita } from 'src/app/models/cita';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { CitaService } from 'src/app/services/cita.service';
import { FechaService } from 'src/app/services/fecha.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';
import { ReagendarCitaModalComponent } from '../reagendar-cita-modal/reagendar-cita-modal.component';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { Area } from 'src/app/models/area';
import { DataService } from 'src/app/shared/services/data.service';
import { MandarConfirmacionesPorFechaComponent } from '../mandar-confirmaciones-por-fecha/mandar-confirmaciones-por-fecha.component';

@Component({
  selector: 'app-confirmaciones-citas',
  templateUrl: './confirmaciones-citas.component.html',
  styleUrls: ['./confirmaciones-citas.component.css'],
})
export class ConfirmacionesCitasComponent implements OnInit {
  fecha: string;
  date = new FormControl(new Date());
  titulo: string;
  minDate: Date;

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 200;
  pageSizeOptions: number[] = [5, 10, 25, 100, 200];

  citas: Cita[] = [];
  citasSinFiltrar: Cita[] = [];
  citasParaFiltrar: Cita[] = [];

  areaFiltrada: Area = null;
  total = 0;
  totalSinConfirmar = 0;
  public darkMode = signal<boolean>(true);
  public studiesColumns: string[] = [
    'Institucion',
    'Paciente',
    'Estudio',
    'Fecha',
    'Hora',
    'Agendo',
    'Estado',
    'Confirmar',
    'Reagendar',
    'Cancelar',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fechaService: FechaService,
    private citaService: CitaService,
    private ventaConceptosService: VentaConceptosService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private dataService: DataService
  ) {
    this.titulo = 'Confirmaciones';
    this.minDate = new Date();
  }
  public cambiarModo(valor: boolean): void {
    this.darkMode.set(valor);
    localStorage.setItem('darkMode', valor.toString());
  }
  onChange(event: any): void {
    const esModoObscuro = event.target.value === 'true';
    this.cambiarModo(esModoObscuro);
  }

  ngOnInit(): void {
    let dark = localStorage.getItem('darkMode');

    if (dark) {
      console.log("Tema en ls")
      let value = dark === 'true' ? true : false;
      this.darkMode.set(value);
    }

    let fechaString = this.fechaService.formatearFecha(this.date.value);
    this.fecha = fechaString;
    this.citaService
      .buscarPorFecha(
        this.fecha,
        this.paginaActual.toString(),
        this.totalPorPagina.toString()
      )
      .subscribe(
        (citas) => {
          if (citas.content) {
            this.citas = citas.content as Cita[];
            this.citasSinFiltrar = this.citas;
            this.totalRegistros = citas.totalElements as number;
            this.total = this.citas.length;
            this.totalSinConfirmar = this.citas.filter(
              (cita) =>
                cita.estado !== 'AGENDADA' && cita.estado !== 'NO_CONTESTADA'
            ).length;
            this.citas.forEach((cita) => {
              this.ventaConceptosService
                .ver(cita.estudio.id)
                .subscribe((venta) => {
                  cita.institucion =
                    venta.institucion.id === 1
                      ? null
                      : venta.institucion.nombre;
                });
            });
          } else {
            this.citas = [];
          }
        },
        (error) => {
          console.log(error);
          this.citas = [];
        }
      );
  }

  public actualizarFecha(fecha: HTMLInputElement) {
    this.fecha = this.fechaService.alistarFechaParaBackend(fecha.value);
    this.buscar();
  }

  recibirAreaFiltrada(event: Area) {
    this.areaFiltrada = event;
    this.dataService.updateAreaData(event);
    this.citas = !event
      ? this.citasSinFiltrar
      : this.citasSinFiltrar.filter((cita) =>
          cita?.estudio?.concepto?.area?.nombre.includes(
            event.nombre.toUpperCase()
          )
        );
    this.total = this.citas.length;
    this.totalSinConfirmar = this.citas.filter(
      (cita) => cita.estado !== 'AGENDADA' && cita.estado !== 'NO_CONTESTADA'
    ).length;
  }

  salaSeleccionada(event: EquipoDicom) {
    this.citas = !event
      ? this.citasSinFiltrar
      : this.citasSinFiltrar.filter((cita) => cita.horario.salaId === event.id);
    this.total = this.citas.length;
    this.totalSinConfirmar = this.citas.filter(
      (cita) => cita.estado !== 'AGENDADA' && cita.estado !== 'NO_CONTESTADA'
    ).length;
  }

  public mandarConfirmacionesManiania() {
    Swal.fire({
      title: '¿Seguro?',
      text: 'Se van a enviar todos los whatsapp para confirmar las citas de mañana',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, mandar whatsapps',
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.mandarConfirmacionesDiaSiguiente().subscribe(
          () => {
            Swal.fire({
              title: 'Éxito',
              text: 'Se están mandando los mensajes',
              icon: 'success',
            });
          },
          () => {
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error',
              icon: 'error',
            });
          }
        );
      }
    });
  }

  abrirMandarConfirmacionesPorFecha() {
    this.dialog.open(MandarConfirmacionesPorFechaComponent, {
      width: '500px',
    });
  }

  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.buscar();
  }

  private buscar() {
    this.citaService
      .buscarPorFecha(
        this.fecha,
        this.paginaActual.toString(),
        this.totalPorPagina.toString()
      )
      .subscribe(
        (citas) => {
          if (citas.content) {
            this.citas = citas.content as Cita[];
            this.citasSinFiltrar = this.citas;
            this.totalRegistros = citas.totalElements as number;
            this.paginator._intl.itemsPerPageLabel = 'Registros:';
            this.total = this.citas.length;
            this.totalSinConfirmar = this.citas.filter(
              (cita) =>
                cita.estado !== 'AGENDADA' && cita.estado !== 'NO_CONTESTADA'
            ).length;
          } else {
            this.citas = [];
          }
        },
        (error) => {
          console.log(error);
          this.citas = [];
        }
      );
  }

  cancelarCita(cita: Cita) {
    Swal.fire({
      title: '¿Seguro que desea cancelar cita?',
      text: 'Esta acción no se puede revertir y se cancelara toda la orden',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar orden',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.cancelarCita(cita.id).subscribe(
          () => {
            Swal.fire({
              title: 'Cita cancelada',
              icon: 'success',
            });
            this.citas = this.citas.filter(
              (citaTemp) => citaTemp.id != cita.id
            );
          },
          () => {
            Swal.fire({
              title: 'Error',
              text: 'Ha ocurrido un error',
              icon: 'error',
            });
          }
        );
      }
    });
  }

  confirmar(cita: Cita) {
    let estudios: VentaConceptos[] = [];
    let estudiosIds: number[] = [];
    const orden = cita.estudio.ordenVenta;
    this.ventaConceptosService.encontrarPorOrdenVentaId(orden.id).subscribe(
      (estudiosResponse) => {
        estudios = estudiosResponse;
        const paciente = cita.estudio.paciente;
        let mensaje: string = '';
        let instruccionesArea: string = '';
        let instruccionesConceptos: string = '';
        for (let estudio of estudios) {
          const fecha = this.datePipe.transform(
            estudio.fechaAsignado,
            'dd/MM/yyyy'
          );
          const concepto = estudio.concepto;
          mensaje += `-${concepto.area.nombre}: ${concepto.concepto} día `;
          mensaje += `${fecha} hora ${estudio.horaAsignado.substring(
            0,
            5
          )}<br>`;
          if (concepto.area.instrucciones) {
            instruccionesArea += concepto.area.instrucciones;
          }
          if (concepto.instrucciones) {
            instruccionesConceptos += concepto.instrucciones;
          }
          estudiosIds.push(estudio.id);
        }
        let total: number = orden.totalSinDescuento;
        if (orden.aplicarDescuento) {
          total = orden.totalDespuesDescuento;
        }
        mensaje += `Total = ${total}<br>`;
        mensaje += instruccionesArea + '<br>';
        mensaje += instruccionesConceptos + '<br>';
        if (estudios[0].institucion?.instrucciones) {
          mensaje += estudios[0].institucion.instrucciones;
        }
        const titulo = `Confirmar cita de ${paciente.nombreCompleto}: ${paciente.telefono}`;
        this.mostrarModalConfirmarCita(titulo, mensaje, estudiosIds, cita);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private mostrarModalConfirmarCita(
    titulo: string,
    mensaje: string,
    idsVentas: number[],
    cita: Cita
  ) {
    Swal.fire({
      title: titulo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#229954',
      cancelButtonColor: '#BDC3C7 ',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      showDenyButton: true,
      denyButtonText: 'No contestó',
      denyButtonColor: '#E67E22 ',
      reverseButtons: true,
      html: mensaje,
    }).then((result) => {
      if (result.isConfirmed) {
        const mensaje =
          idsVentas.length > 1
            ? 'Se han confirmado las citas'
            : 'Se ha confirmado la cita';
        const titular = idsVentas.length > 1 ? 'Confirmadas' : 'Confirmada';
        this.citaService.confirmarCitas(idsVentas).subscribe(
          () => {
            Swal.fire(titular, mensaje, 'success');
            cita.estado = 'CONFIRMADA';
          },
          () => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');
          }
        );
      }
      if (result.isDenied) {
        this.citaService.citaNoContestada(cita.id).subscribe(
          () => {
            cita.estado = 'NO_CONTESTADA';
          },
          (error) => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');
            console.log(error);
          }
        );
      }
    });
  }

  public reagendar(cita: Cita) {
    const dialogRef = this.dialog.open(ReagendarCitaModalComponent, {
      data: { cita: cita },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const nuevaCitaId: number = result.citaId as number;
        const equipoDicom: EquipoDicom = result.equipoDicom as EquipoDicom;
        cita.estudio.equipoDicom = equipoDicom;
        Swal.fire({
          title: '¿Seguro que desea reagendar?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, seguro',
          cancelButtonText: 'Cancelar',
          text: '¿Desea reagendar para esa hora?',
        }).then((result) => {
          if (result.isConfirmed) {
            this.mensajeReagendado(cita, nuevaCitaId, cita);
          }
        });
      }
    });
  }

  private mensajeReagendado(
    cita: Cita,
    citaDestinoId: number,
    citaModificar: Cita
  ) {
    const citaOrigenId = cita.id;
    this.citaService
      .reagendar(
        citaOrigenId,
        citaDestinoId,
        citaModificar,
        cita.estudio.concepto.espaciosAgenda
      )
      .subscribe(
        (cita) => {
          Swal.fire(
            'Éxito',
            'Se ha reagendado correctamente la cita',
            'success'
          );
          this.citas = this.citas.filter((c) => c.id != citaModificar.id);
          cita.estudio = citaModificar.estudio;
          this.citas.push(cita);
        },
        (error) => {
          Swal.fire('Error', error.error.detail, 'error');
        }
      );
  }
}
