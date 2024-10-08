import { Component, OnInit, Inject, signal } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Area } from '../../../models/area';
import { Paciente } from '../../../models/paciente';
import { VentaConceptosService } from '../../../services/venta-conceptos.service';
import { AreasService } from '../../../services/areas.service';
import { PacientesService } from '../../../services/pacientes.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonListarComponent } from '../../../components/common-listar.component';
import { VentaConceptos } from '../../../models/venta-conceptos';
import { map } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FechaService } from 'src/app/services/fecha.service';
import { EnviarEstudioComponent } from '../enviar-estudio/enviar-estudio.component';
import { EnviarResultadosComponent } from 'src/app/instituciones/components/enviar-resultados/enviar-resultados.component';

@Component({
  selector: 'app-enviar-estudios',
  templateUrl: './enviar-estudios.component.html',
  styleUrls: ['./enviar-estudios.component.css'],
})
export class EnviarEstudiosComponent
  extends CommonListarComponent<VentaConceptos, VentaConceptosService>
  implements OnInit
{
  autocompleteControl = new UntypedFormControl();
  autocompleteControlPaciente = new UntypedFormControl();
  areasFiltradas: Area[] = [];
  pacientesFiltrados: Paciente[] = [];
  fechaInicio = '';
  fechaFin = '';
  selected = signal<number>(null);
  pastDates = signal<boolean>(false);

  constructor(
    service: VentaConceptosService,
    @Inject(AreasService) private areasService: AreasService,
    @Inject(PacientesService) private pacienteService: PacientesService,
    private pipe: DatePipe,
    public dialog: MatDialog,
    private fechaService: FechaService
  ) {
    super(service);
    this.titulo = 'Listado de estudios';
    this.nombreModel = 'Estudio';
  }

  override ngOnInit(): void {
    var selectedDate = localStorage.getItem('selectedDay');
    if (selectedDate === this.fechaHoy()) {
      this.selected.set(parseInt(localStorage.getItem('selected')));
    }
    this.buscarEstudiosDeHoy();

    this.autocompleteControl.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        flatMap((valor) =>
          valor ? this.areasService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((areas) => (this.areasFiltradas = areas));

    this.autocompleteControlPaciente.valueChanges
      .pipe(
        map((valor) =>
          typeof valor === 'string' ? valor : valor.nombreCompleto
        ),
        flatMap((valor) =>
          valor ? this.pacienteService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((pacientes) => (this.pacientesFiltrados = pacientes));
  }

  mostrarNombre(area?: Area): string {
    return area ? area.nombre : '';
  }

  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  buscarEstudiosDeHoy(): void {
    this.service.filtrarDiaDeHoy().subscribe(
      (estudios) => (this.lista = estudios),
      (e) => {
        if (e.status === 404) {
          this.lista = [];
        }
      }
    );
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent): void {
    this.selected.set(null);
    const area = event.option.value as Area;

    if (this.errorEnFechas()) {
      this.crearRangoDeDosMesesEnBaseAHoy();
    }

    this.service
      .filtrarRangoYArea(this.fechaInicio, this.fechaFin, area.id)
      .subscribe(
        (estudios) => {
          this.lista = estudios;
        },
        (e) => {
          if (e.status === 404) {
            this.lista = [];
          }
        }
      );

    this.autocompleteControl.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    this.selected.set(null);
    this.pastDates.set(true);
    const paciente = event.option.value as Paciente;

    if (this.errorEnFechas()) {
      this.crearRangoDeDosMesesEnBaseAHoy();
    }

    this.service
      .filtrarRangoYPaciente(this.fechaInicio, this.fechaFin, paciente.id)
      .subscribe(
        (estudios) => {
          this.lista = estudios;
        },
        (e) => {
          if (e.status === 404) {
            this.lista = [];
          }
        }
      );

    this.autocompleteControlPaciente.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  private errorEnFechas(): boolean {
    return this.fechaInicio === '' || this.fechaFin === '';
  }

  private crearRangoDeDosMesesEnBaseAHoy(): void {
    this.fechaInicio = this.sumarMesesAFechaDeHoy(-1);
    this.fechaFin = this.sumarMesesAFechaDeHoy(1);
    console.log(this.fechaInicio + ' ' + this.fechaFin);
  }

  private sumarMesesAFechaDeHoy(cantidad: number): string {
    const hoy = new Date(Date.now());
    const sumada = new Date(
      hoy.getFullYear(),
      hoy.getMonth() + cantidad,
      hoy.getDate()
    );
    return this.pipe.transform(sumada, 'yyyy-MM-dd');
  }

  buscarPorFecha(
    fechaInicio: HTMLInputElement,
    fechaFin: HTMLInputElement
  ): void {
    this.selected.set(null);
    this.pastDates.set(true);
    if (fechaInicio.value !== '' && fechaFin.value !== '') {
      this.fechaInicio = this.fechaService.alistarFechaParaBackend(
        fechaInicio.value
      );
      this.fechaFin = this.fechaService.alistarFechaParaBackend(fechaFin.value);

      console.log(this.fechaInicio + ' ' + this.fechaFin);

      this.service.filtrarRango(this.fechaInicio, this.fechaFin).subscribe(
        (estudios) => (this.lista = estudios),
        (e) => {
          if (e.status === 404) {
            this.lista = [];
          }
        }
      );
    } else {
      this.fechaInicio = '';
      this.fechaFin = '';
    }
  }

  enviar(estudio: VentaConceptos, index: number): void {
    console.log(this.pastDates());
    this.selected.set(index);
    if (!this.pastDates()) {
      localStorage.setItem('selected', index.toString());
      localStorage.setItem('selectedDay', this.fechaHoy());
    }
    this.dialog.open(EnviarEstudioComponent, {
      data: estudio,
    });
  }

  enviarResultado(estudio: VentaConceptos, index: number): void {
    this.selected.set(index);
    if (!this.pastDates()) {
      localStorage.setItem('selected', index.toString());
      localStorage.setItem('selectedDay', this.fechaHoy());
    }
    this.dialog.open(EnviarResultadosComponent, {
      data: estudio,
      width: '800px',
    });
  }

  private fechaHoy(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }
}
