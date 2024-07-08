import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { flatMap, map } from 'rxjs';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { Study } from 'src/app/models/study';
import { ConceptoPrecio } from 'src/app/precios/models/concepto-precio';
import { PreciosService } from 'src/app/precios/services/precios.service';
import { AreasService } from 'src/app/services/areas.service';
import { ConceptosService } from 'src/app/services/conceptos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
})
export class CatalogoComponent implements OnInit {
  constructor(
    private conceptoService: ConceptosService,
    private areasService: AreasService,
    private service: PreciosService
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('nombreBuscar') nombreBuscar: ElementRef = null;

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  lista: ConceptoPrecio[] = [];
  conceptosFiltrados: Concepto[] = [];
  areasFiltradas: Area[] = [];
  buscarPorArea: boolean = false;
  areaControl: string = '';
  area: Area = new Area();
  estudios: Study[] = [];
  autocompleteControl = new FormControl(null);
  nombreConcepto: string = '';

  ngOnInit(): void {
    this.calcularRangos();

    this.autocompleteControl.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        flatMap((valor) =>
          valor ? this.areasService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((areas) => (this.areasFiltradas = areas));
  }

  buscarPorNombre() {
    this.buscarPorArea = false;

    this.nombreConcepto = this.nombreBuscar?.nativeElement.value;

    this.calcularRangos();
  }

  public calcularRangos(): void {
    //Se me ocurre que aquí puedo poner ifs para saber hacia qué service paginar

    if (
      this.nombreConcepto &&
      this.nombreConcepto != '' &&
      !this.buscarPorArea
    ) {
      return this.buscarPreciosPorNombre(this.nombreConcepto);
    }

    if (this.area && this.buscarPorArea) {
      this.buscarPreciosPorArea(this.area.id);
      return;
    }
  }

  private buscarPreciosPorArea(areaId: number) {
    this.service
      .buscarPorArea(
        areaId,
        this.paginaActual.toString(),
        this.totalPorPagina.toString()
      )
      .subscribe((p) => {
        this.lista = p.content as ConceptoPrecio[];
        this.totalRegistros = p.totalElements as number;
        this.paginator._intl.itemsPerPageLabel = 'Registros:';
      });
  }
  private buscarPreciosPorNombre(nombreBuscar: string) {
    this.service
      .buscarPorNombre(
        nombreBuscar,
        this.paginaActual.toString(),
        this.totalPorPagina.toString()
      )
      .subscribe(
        (p) => {
          this.lista = p.content;
          this.totalRegistros = p.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros:';
          console.log(this.lista);
        },
        (error) => {
          if (error.status == 404) {
            Swal.fire(
              'No encontrado',
              'No existe el estudio ' + nombreBuscar,
              'error'
            );
            this.nombreBuscar.nativeElement.value = '';
          }
        }
      );
  }
  seleccionarArea(event: MatAutocompleteSelectedEvent): void {
    const area = event.option.value as Area;
    this.area = area;
    this.buscarPorArea = true;
    this.calcularRangos();
    this.autocompleteControl.setValue('');
    event.option.deselect();
    event.option.focus();
  }
  mostrarNombre(area?: Area): string {
    return area ? area.nombre : '';
  }
  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }
}
