import { Component, OnInit, ViewChild } from '@angular/core';
import { FechaService } from 'src/app/services/fecha.service';
import { MedicoReferenteService } from '../../services/medico-referente.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
    private router: Router
  ) {}
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fechaInicio: string = '';
  fechaFin: string = '';
  busquedaPorFechas: boolean = false;
  busquedaPorPaciente: boolean = false;
  medicoReferente;
  paginaActual = 0;
  totalPorPagina = 10;
  totalRegistros = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  lista: OrdenVenta[] = [];

  ngOnInit(): void {
    // const username: string = this.tokenService.getUsername();
    // if (!username) {
    //   this.router.navigate(['/']);
    // }
    // this.medicoReferenteService.buscarMedicoReferentePorUsuario(username).subscribe(
    //   medicoReferente => {
    //     console.log("medicoReferente buscado")
    //     this.medicoReferente = medicoReferente;
    //     this.buscarPorFechas();
    //   }
    //   ,
    //   err => {
    //     this.router.navigate(["/"]);
    //     console.log(err);
    //   })
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
    // if (this.busquedaPorPaciente) {
    //   this.buscarPorPaciente();
    //   return;
    // }

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
          console.log(this.lista)
        },
        (error) => console.log(error)
      );
  }
  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.buscar();
  }
}
