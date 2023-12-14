import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  constructor(
    private fechaService: FechaService,
    private citaService: CitaService
  ) {
    this.titulo = "Confirmaciones";
    this.minDate = new Date();
   }

  ngOnInit(): void {
    const fechaString = this.fechaService.formatearFecha(this.date.value);
    console.log(fechaString);
    this.citaService.buscarPorFecha(fechaString, this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(
      citas => {
        if(citas.content){
          this.citas = citas.content;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public actualizarFecha(fecha: HTMLInputElement){
    this.fecha = this.fechaService.alistarFechaParaBackend(fecha.value);
    console.log(this.fecha);
    //Buscar citas dada fecha
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
}
