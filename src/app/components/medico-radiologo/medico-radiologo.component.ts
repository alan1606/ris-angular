import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Medico } from 'src/app/models/medico';
import { Paciente } from 'src/app/models/paciente';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { MedicoService } from 'src/app/services/medico.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';

@Component({
  selector: 'app-medico-radiologo',
  templateUrl: './medico-radiologo.component.html',
  styleUrls: ['./medico-radiologo.component.css']
})
export class MedicoRadiologoComponent implements OnInit {

  titulo: string;
  medico: Medico;
  estudios: VentaConceptos[] = [];
  fecha: string;
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  autocompleteControlPaciente = new FormControl();
  pacientesFiltrados: Paciente[] = [];
  estado = 'INTERPRETANDO';

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private service: MedicoService,
    private ventaConceptosService: VentaConceptosService,
    private router: Router,
    private route: ActivatedRoute,
    private pipe: DatePipe,
    private pacienteService: PacientesService) {

  }

  ngOnInit(): void {

    this.titulo = "Lista de estudios";

    this.fecha = this.pipe.transform(new Date(), 'yyyy-MM-dd');

    //Se encuentra el medico dado el token en la ruta
    this.route.paramMap.subscribe(params => {
      const token: string = params.get('token');
      if (token) {
        this.service.encontrarRadiologoPorToken(token).subscribe(medico => {
          this.medico = medico;
          this.cargarEstudios();
        }, error => {
          //this.router.navigate(['/agenda']);
        });
      }
    });


    this.autocompleteControlPaciente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombreCompleto),
      flatMap(valor => valor ? this.pacienteService.filtrarPorNombreYRadiologoId(valor, this.medico.id) : [])
    ).subscribe(pacientes => this.pacientesFiltrados = pacientes);

  }

  cargarEstudios() {
    if (this.medico && this.medico.id) {
      this.ventaConceptosService.encontrarPorMedicoRadiologoId(this.paginaActual.toString(), this.totalPorPagina.toString(), this.medico.id)
        .subscribe(p => {
          this.estudios = p.content as VentaConceptos[];
          this.totalRegistros = p.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros:';
          console.log(this.estudios);
        });
    }
  }


  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.cargarEstudios();
  }

  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  buscarPorPaciente(event: MatAutocompleteSelectedEvent): void {
    const paciente = event.option.value as Paciente;

    this.buscar(this.fecha, this.estado, paciente);
    this.autocompleteControlPaciente.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  buscarPorFecha(fecha: HTMLInputElement) {
    this.fecha = this.pipe.transform(new Date(fecha.value), 'yyyy-MM-dd');
    this.buscar(this.fecha, this.estado, null);
  };

  buscarPorEstado() {
    this.buscar(this.fecha, this.estado, null);
  };

  buscar(fecha: string, estado: string, paciente: Paciente) {
    if (paciente) {
      this.ventaConceptosService.encontrarPorMedicoRadiologoIdFechaEstadoPaciente(this.paginaActual.toString(), this.totalPorPagina.toString(),
      this.medico.id, fecha, estado, paciente).subscribe(p => {
        this.estudios = p.content as VentaConceptos[];
        this.totalRegistros = p.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = 'Registros:';
        console.log(this.estudios);
      });
      return;
    }

    this.ventaConceptosService.encontrarPorMedicoRadiologoIdFechaEstado(this.paginaActual.toString(), this.totalPorPagina.toString(),
      this.medico.id, fecha, estado).subscribe(p => {
        this.estudios = p.content as VentaConceptos[];
        this.totalRegistros = p.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = 'Registros:';
        console.log(this.estudios);
      });
  }

  ver(estudio: VentaConceptos){
    this.router.navigate([`/dictamen/${estudio.idPacs}`]);
  }

  abrirDictador(estudio: VentaConceptos){
    this.router.navigate([`/dictador/${estudio.id}`]);
  }
}
