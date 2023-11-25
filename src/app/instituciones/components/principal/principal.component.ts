import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { InstitucionService } from 'src/app/services/institucion.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  lista = [{"id":1,"paciente":"alan","estudios":"vaginal,anal,oral", "fecha": Date()}, {"id":1,"paciente":"juan","estudios":"anal", "fecha":new Date()},{"id":1,"paciente":"emmanuel","estudios":"oral", "fecha":new Date()}];
  range = new FormGroup({
    start: new FormControl<Date>(new Date()),
    end: new FormControl<Date>(new Date()),
  });
  value = '';
  constructor(
    private institucionService: InstitucionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.lista);
    if (this.lista.length == 0) {
      console.log('lista vacia');
    }
  }

  onStartDateChange(event: any): void {
    console.log('Nuevo valor de fecha de inicio:', event.value);
  }

  onEndDateChange(event: any): void {
    console.log('Nuevo valor de fecha de fin:', event.value);
  }

  verOrden(ordenId: number, pacienteId: number): void {
    this.router.navigate([`/resultados/orden/${ordenId}/${pacienteId}`]);
  }

  enviarResultado(ordenId: number, pacienteId: number): void {
    this.router.navigate([`/resultados/orden/${ordenId}/${pacienteId}`]);
  }

  buscarPaciente(id: number, idinstitucion: number): void {
    this.institucionService.buscarPorPaciente(id, idinstitucion).subscribe(
      (datos) => {
        // this.lista = datos;
        console.log(datos);
      },
      (e) => {
        console.log(e);
      }
    );
  }
  buscarFecha(fechaInicio: string, fechaFin: string): void {
    this.institucionService.buscarPorFecha('', '').subscribe(
      (datos) => {
        // this.lista = datos;
      },
      (e) => {
        console.log(e);
      }
    );
  }
}
