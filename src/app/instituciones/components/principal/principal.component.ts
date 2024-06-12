import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { InstitucionService } from 'src/app/services/institucion.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { Institucion } from 'src/app/models/institucion';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Paciente } from 'src/app/models/paciente';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, mergeMap } from 'rxjs';
import { PacientesService } from 'src/app/services/pacientes.service';
import { FechaService } from 'src/app/services/fecha.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  fechaInicio = '';
  fechaFin = '';
  institucion: Institucion;
  lista = [];
  NombrePaciente = '';
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  paciente: Paciente;
  autocompleteControlPaciente = new FormControl();
  pacientesFiltrados: Paciente[] = [];
  busquedaPorPaciente = false;
  busquedaPorFechas = true;
  constructor(
    private institucionService: InstitucionService,
    private router: Router,
    private tokenService: TokenService,
    private datePipe: DatePipe,
    private pacienteService: PacientesService,
    private fechaService: FechaService
  ) {
    this.fechaInicio = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.fechaFin = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    const username: string = this.tokenService.getUsername();
    if (!username) {
      this.router.navigate(['/']);
    }

    this.institucionService.buscarInstitucionPorUsuario(username).subscribe(
      institucion => {
        this.institucion = institucion;

        this.buscarPorFechas();
      }
      ,
      err => {
        this.router.navigate(["/"]);
        console.log(err);
      }
    );


    this.autocompleteControlPaciente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombreCompleto),
      mergeMap(valor => valor ? this.pacienteService.filtrarPorNombre(valor) : [])
    ).subscribe(pacientes => this.pacientesFiltrados = pacientes);

  }



  onEndDateChange(fechaInicio: HTMLInputElement, fechaFin: HTMLInputElement): void {
    if (fechaInicio.value !== '' && fechaFin.value !== '') {
      this.fechaInicio = this.fechaService.alistarFechaParaBackend(fechaInicio.value);
      this.fechaFin = this.fechaService.alistarFechaParaBackend(fechaFin.value);

      console.log(this.fechaInicio, this.fechaFin);
      this.busquedaPorFechas = true;
      this.buscar();
    }
    else {
      this.fechaInicio = '';
      this.fechaFin = '';
    }
  }


  verOrden(orden: OrdenVenta): void {
    this.router.navigate([`/resultados/orden/${orden.id}/${orden.paciente.id}`]);
  }

  enviarResultado(orden: OrdenVenta): void {
    window.open(`/ris/instituciones/enviar/${orden.id}`, '_blank');
  }

  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;

    this.buscar();
  }

  private buscar() {

    if (this.busquedaPorPaciente) {
      this.buscarPorPaciente();
      return;
    }

    this.buscarPorFechas();

    this.busquedaPorFechas = false;
    this.busquedaPorPaciente = false;
  }


  private buscarPorFechas() {
    this.institucionService.buscarOrdenesPorInstitucionYFechas(this.paginaActual.toString(), this.totalPorPagina.toString(), this.institucion.id, this.fechaInicio, this.fechaFin).subscribe(
      lista => {
        this.lista = lista.content as OrdenVenta[];
        this.totalRegistros = lista.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = 'Registros:';
      },
      error => console.log(error)
    );
  }
  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    const paciente = event.option.value as Paciente;
    this.paciente = paciente;

    this.busquedaPorPaciente = true;

    this.buscar();
    event.option.value = "";
    event.option.deselect();
    event.option.focus();
  }

  private buscarPorPaciente() {
    this.institucionService.buscarOrdenesPorInstitucionYPaciente(this.paginaActual.toString(), this.totalPorPagina.toString(), this.paciente.id, this.institucion.id).subscribe(
      lista => {
        this.lista = lista.content as OrdenVenta[];
        this.totalRegistros = lista.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = 'Registros:';
      },
      error => console.log(error)
    );
  }
}
