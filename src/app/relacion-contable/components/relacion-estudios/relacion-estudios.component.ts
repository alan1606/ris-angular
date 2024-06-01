import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Study } from 'src/app/models/study';
import { MedicoService } from 'src/app/services/medico.service';
import { TokenService } from 'src/app/services/token.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import Swal from 'sweetalert2';

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
  medicoSeleccionado(event) {
    console.log(event);
    this.username = event.usuario;
  }
  buscar(): void {
    console.log('entro');
    console.log(this.username);
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
          console.log(data);
        },
        (error) => {
          this.alertaService.error(error);
        }
      );
  }
}
