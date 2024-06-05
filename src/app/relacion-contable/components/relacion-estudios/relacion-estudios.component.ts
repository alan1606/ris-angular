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
  esRadiologo: boolean = false;
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
    private medicoService: MedicoService,
    private alertaService: AlertaService
  ) {
    this.estudiosDataSource = new MatTableDataSource(this.estudios);
  }
  ngOnInit(): void {
    this.esRadiologo = this.tokenService.isRadiologicPhysician();
    this.esAdmin = this.tokenService.isAdmin();
    console.log(this.tokenService.getUsername());
    console.log(this.esRadiologo);
    if (this.esRadiologo) {
      this.username = this.tokenService.getUsername();
    }
  }

  fechasEmitidas({ inicio, fin }): void {
    this.fechaInicioControl = inicio;
    this.fechaFinControl = fin;
  }
  medicoSeleccionado(event: Medico) {
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
          if (data.length <= 0) {
            this.alertaService.campoInvalido(
              'No hay estudios',
              'Seleccione otras fechas'
            );
          }
          console.log(data);
          this.estudios = data;
          this.estudiosDataSource.data = this.estudios;
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
  ver(estudio: any): void {
    window.open(`${VIEWER}${estudio.uid}`);
  }

  imprimir(): void {
    this.medicoService.descargarRelacionDeMedicoPDF(
      this.username,
      this.fechaInicioControl,
      this.fechaFinControl
    );
  }
}
