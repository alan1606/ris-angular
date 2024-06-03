import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { VIEWER } from 'src/app/config/app';
import { Medico } from 'src/app/models/medico';
import { Study } from 'src/app/models/study';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { MedicoService } from 'src/app/services/medico.service';
import { TokenService } from 'src/app/services/token.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';

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
  estudios: Study[] = [];
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
  areas: [] = [];
  constructor(
    private tokenService: TokenService,
    private ventaConceptosService: VentaConceptosService,
    private medicoService: MedicoService,
    private alertaService: AlertaService
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
  medicoSeleccionado(event: Medico) {
    console.log(event);
    this.username = event.usuario;
  }
  buscar(): void {
    if (this.username === '') {
      this.alertaService.campoInvalido('Seleccione un medico');
      return;
    }
    if (this.fechaInicioControl === '' || this.fechaFinControl === '') {
      this.alertaService.campoInvalido('Seleccione las fechas');
      return;
    }
    this.medicoService
      .obtenerRelacionEstudios(
        this.username,
        this.fechaInicioControl,
        this.fechaFinControl
      )
      .subscribe(
        (data) => {
          this.estudios = data;
          this.estudiosDataSource.data = this.estudios;
          console.log(data)
          this.areas = data.reduce((contador, estudio) => {
            const area = estudio.area;
            contador[area] = (contador[area] || 0) + 1;
            return contador;
          }, {});
        },
        (error) => {
          this.alertaService.error(error);
        }
      );
  }
  ver(estudio): void {
    window.open(`${VIEWER}${estudio.uid}`);
  }
}
