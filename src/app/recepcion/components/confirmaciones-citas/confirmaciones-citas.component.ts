import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Cita } from 'src/app/models/cita';
import { CitaService } from 'src/app/services/cita.service';
import { FechaService } from 'src/app/services/fecha.service';
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
    private citaService: CitaService
  ) {
    this.titulo = "Confirmaciones";
    this.minDate = new Date();
   }


  ngOnInit(): void {
    const fechaString = this.fechaService.formatearFecha(this.date.value);
    this.fecha = fechaString;
    this.citaService.buscarPorFecha(this.fecha, this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(
      citas => {
        if(citas.content){
          this.citas = citas.content as Cita[];
          this.totalRegistros = citas.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros:';
        }
        else{
          this.citas = [];
        }
      },
      error => {
        console.log(error);
        this.citas = [];
      }
    );
  }

  public actualizarFecha(fecha: HTMLInputElement){
    this.fecha = this.fechaService.alistarFechaParaBackend(fecha.value);
    console.log(this.fecha);
    this.buscar();
  };

  public mandarConfirmacionesManiania(){
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

  private buscar(){
    this.citaService.buscarPorFecha(this.fecha, this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(
      citas => {
        if(citas.content){
          this.citas = citas.content as Cita[];
          this.totalRegistros = citas.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros:';
        }
        else{
          this.citas = [];
        }
      },
      error => {
        console.log(error);
        this.citas = [];
      }
    );
  }

  cancelarCita(cita: Cita){
    Swal.fire({
      title: "¿Seguro que desea cancelar cita?",
      text: "Esta acción no se puede revertir y se liberará el lugar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar"
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
}
