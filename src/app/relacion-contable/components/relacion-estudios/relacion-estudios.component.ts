import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Study } from 'src/app/models/study';
import { TokenService } from 'src/app/services/token.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';

@Component({
  selector: 'app-relacion-estudios',
  templateUrl: './relacion-estudios.component.html',
  styleUrls: ['./relacion-estudios.component.css'],
})
export class RelacionEstudiosComponent implements OnInit {
  labelFechaInicio: string = 'Fecha inicio';
  labelFechaFin: string = 'Fecha fin';
  fechaInicioControl: string = '';
  fechaFinControl: string = '';
  estudios: Study[] = [new Study()];
  estudiosDataSource: MatTableDataSource<Study>;
  esReferente: boolean = false;
  esAdmin: boolean = false;
  estudiosDisplayedColumns: string[] = [
    'Area',
    'Estudio',
    'Fecha',
    'Ver estudio',
  ];
  username: string = '';
  constructor(
    private tokenService: TokenService,
    private ventaConceptosService: VentaConceptosService
  ) {
    this.estudiosDataSource = new MatTableDataSource(this.estudios);
  }
  ngOnInit(): void {
    this.esReferente = this.tokenService.isReferring();
    this.esAdmin = this.tokenService.isAdmin();
    if (this.esReferente) {
      this.username = this.tokenService.getUsername();
    }
  }

  fechasEmitidas({ inicio, fin }): void {
    this.fechaInicioControl = inicio;
    this.fechaFinControl = fin;
    console.log(this.fechaInicioControl, this.fechaFinControl);
  }
}
