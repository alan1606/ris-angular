import { Component, OnInit, ViewChild } from '@angular/core';
import { FechaService } from 'src/app/services/fecha.service';
import { MedicoReferenteService } from '../../services/medico-referente.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Paciente } from 'src/app/models/paciente';
import { FormControl } from '@angular/forms';
import { map, mergeMap } from 'rxjs';
import { PacientesService } from 'src/app/services/pacientes.service';

@Component({
  selector: 'app-estudios',
  templateUrl: './estudios.component.html',
  styleUrls: ['./estudios.component.css'],
})
export class EstudiosComponent implements OnInit {
  constructor(
    private fechaService: FechaService,
    private medicoReferenteService: MedicoReferenteService,
    private tokenService: TokenService,
    private router: Router,
    private pacienteService:PacientesService
  ) {}
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fechaInicio: string = '';
  fechaFin: string = '';
  busquedaPorFechas: boolean = false;
  busquedaPorPaciente: boolean = false;
  paciente: Paciente;
  autocompleteControlPaciente = new FormControl();
  pacientesFiltrados: Paciente[] = [];
  medicoReferente;
  paginaActual = 0;
  totalPorPagina = 10;
  totalRegistros = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  lista: OrdenVenta[] = [];

  ngOnInit(): void {
    this.autocompleteControlPaciente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombreCompleto),
      mergeMap(valor => valor ? this.pacienteService.filtrarPorNombre(valor) : [])
    ).subscribe(pacientes => this.pacientesFiltrados = pacientes);

  }

  buscarPorFecha(fechaInicio: HTMLInputElement, fechaFin: HTMLInputElement) {
    if (fechaInicio.value !== '' && fechaFin.value !== '') {
      this.fechaInicio = this.fechaService.alistarFechaParaBackend(
        fechaInicio.value
      );
      this.fechaFin = this.fechaService.alistarFechaParaBackend(fechaFin.value);
      this.busquedaPorFechas = true;
      this.buscar();
    } else {
      this.fechaInicio = '';
      this.fechaFin = '';
    }
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
    this.medicoReferenteService
      .buscarOrdenesPorMedicoYFechas(
        this.paginaActual.toString(),
        this.totalPorPagina.toString(),
        1,
        this.fechaInicio,
        this.fechaFin
      )
      .subscribe(
        (lista) => {
          this.lista = lista.content as OrdenVenta[];
          this.totalRegistros = lista.totalElements as number;
          console.log(this.lista);
        },
        (error) => console.log(error)
      );
  }
  private buscarPorPaciente() {
    this.medicoReferenteService.buscarOrdenesPorInstitucionYPaciente(this.paginaActual.toString(), this.totalPorPagina.toString(), this.paciente.id, 1).subscribe(
      lista => {
        this.lista = lista.content as OrdenVenta[];
        this.totalRegistros = lista.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = 'Registros:';
      },
      error => console.log(error)
    );
  }

  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    const paciente = event.option.value as Paciente;
    this.paciente = paciente;

    this.busquedaPorPaciente = true;

    this.buscar();
    event.option.value = '';
    event.option.deselect();
    event.option.focus();
  }
  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  ver(orden: OrdenVenta): void {
    this.router.navigate([
      `/resultados/orden/${orden.id}/${orden.paciente.id}`,
    ]);
  }
  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.buscar();
  }
}
