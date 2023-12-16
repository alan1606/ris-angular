import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Cita } from 'src/app/models/cita';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { CitaService } from 'src/app/services/cita.service';
import { FechaService } from 'src/app/services/fecha.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirmaciones-citas',
  templateUrl: './confirmaciones-citas.component.html',
  styleUrls: ['./confirmaciones-citas.component.css']
})
export class ConfirmacionesCitasComponent implements OnInit {

  fecha: string;
  date = new FormControl(new Date());
  titulo: string;
  citas: Cita[] = [];
  minDate: Date;


  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private fechaService: FechaService,
    private citaService: CitaService,
    private ventaConceptosService: VentaConceptosService,
    private datePipe: DatePipe
  ) {
    this.titulo = "Confirmaciones";
    this.minDate = new Date();
  }


  ngOnInit(): void {
    const fechaString = this.fechaService.formatearFecha(this.date.value);
    this.fecha = fechaString;
    this.citaService.buscarPorFecha(this.fecha, this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(
      citas => {
        if (citas.content) {
          this.citas = citas.content as Cita[];
          this.totalRegistros = citas.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros:';
        }
        else {
          this.citas = [];
        }
      },
      error => {
        console.log(error);
        this.citas = [];
      }
    );
  }

  public actualizarFecha(fecha: HTMLInputElement) {
    this.fecha = this.fechaService.alistarFechaParaBackend(fecha.value);
    console.log(this.fecha);
    this.buscar();
  };

  public mandarConfirmacionesManiania() {
    Swal.fire({
      title: "¿Seguro?",
      text: "Se van a enviar todos los whatsapp para confirmar las citas de mañana",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, mandar whatsapps"
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.mandarConfirmacionesDiaSiguiente().subscribe(
          () => {
            Swal.fire({
              title: "Éxito",
              text: "Se están mandando los mensajes",
              icon: "success"
            });
          },
          () => {
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error",
              icon: "error"
            });
          }
        );

      }
    });
  }

  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;

    this.buscar();
  }

  private buscar() {
    this.citaService.buscarPorFecha(this.fecha, this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(
      citas => {
        if (citas.content) {
          this.citas = citas.content as Cita[];
          this.totalRegistros = citas.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros:';
        }
        else {
          this.citas = [];
        }
      },
      error => {
        console.log(error);
        this.citas = [];
      }
    );
  }

  cancelarCita(cita: Cita) {
    Swal.fire({
      title: "¿Seguro que desea cancelar cita?",
      text: "Esta acción no se puede revertir y se liberará el lugar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.cancelarCita(cita.id).subscribe(
          () => {
            Swal.fire({
              title: "Éxito",
              text: "Se ha cancelado la cita con éxito",
              icon: "success"
            });
            this.citas = this.citas.filter(citaTemp => citaTemp.id != cita.id);
          },
          () => {
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error",
              icon: "error"
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
    console.log(cita);
    this.ventaConceptosService.encontrarPorOrdenVentaId(orden.id).
      subscribe(
        estudiosResponse => {
          estudios = estudiosResponse;
          const paciente = cita.estudio.paciente;
          let mensaje: string = '';
          let instruccionesArea: string= '';
          let instruccionesConceptos: string='';

          for (let estudio of estudios) {
            const fecha = this.datePipe.transform(new Date(estudio.fechaAsignado), "dd/MM/yyyy");
            const concepto = estudio.concepto;
            mensaje += `-${concepto.area.nombre}: ${concepto.concepto} día `;
            mensaje += `${fecha} hora ${estudio.horaAsignado.substring(0,5)}<br>`;
            if(concepto.area.instrucciones){
              instruccionesArea += concepto.area.instrucciones;
            }
            if(concepto.instrucciones){
              instruccionesConceptos += concepto.instrucciones;
            }
            estudiosIds.push(estudio.id);
          }
          let total: number =  orden.totalSinDescuento;
          if(orden.aplicarDescuento){
            total = orden.totalDespuesDescuento;
          }

          mensaje += `Total = ${total}<br>`;
          mensaje += instruccionesArea + "<br>";
          mensaje += instruccionesConceptos + "<br>";

          if(estudios[0].institucion?.instrucciones){
            mensaje += estudios[0].institucion.instrucciones;
          }
          const titulo = `Confirmar cita de ${paciente.nombreCompleto}: ${paciente.telefono}`;
          this.mostrarModalConfirmarCita(titulo, mensaje, estudiosIds);
        },
        error => {
          console.log(error);
        }
      );

  }


  private mostrarModalConfirmarCita(titulo: string, mensaje: string, idsVentas: number[]) {
    Swal.fire({
      title: titulo,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      html: mensaje
    }).then((result) => {
      if (result.isConfirmed) {
        const mensaje = idsVentas.length > 1 ? "Se han confirmado las citas": "Se ha confirmado la cita";
        const titular = idsVentas.length > 1 ? "Confirmadas": "Confirmada";
        this.citaService.confirmarCitas(idsVentas).subscribe(()=>{
          Swal.fire(titular, mensaje, 'success');
        }, ()=>{
          Swal.fire("Error", "Ha ocurrido un error", "error");
        }
        );
      }
    });
  }
}
