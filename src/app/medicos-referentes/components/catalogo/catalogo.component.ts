import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { flatMap, map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { Study } from 'src/app/models/study';
import { ConceptoPrecio } from 'src/app/precios/models/concepto-precio';
import { PreciosService } from 'src/app/precios/services/precios.service';
import { AreasService } from 'src/app/services/areas.service';
import { ConceptosService } from 'src/app/services/conceptos.service';

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

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  lista: ConceptoPrecio[];
  conceptosFiltrados: Concepto[] = [];
  areasFiltradas: Area[] = [];
  buscarPorArea: boolean = false;
  areaControl: string = '';
  area: Area = new Area();
  estudios: Study[] = [];
  autocompleteControlArea: UntypedFormControl = new UntypedFormControl();
  autocompleteControlConcepto: UntypedFormControl = new UntypedFormControl();

  ngOnInit(): void {
    this.autocompleteControlArea.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        flatMap((valor) =>
          valor ? this.areasService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((areas) => {
        this.areasFiltradas = areas;
        this.buscarPorArea = true;
        this.calcularRangos()
      });

    this.autocompleteControlConcepto.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.concepto)),
        mergeMap((valor) =>
          valor && this.area?.id
            ? this.conceptoService.buscarLikeNombreEnArea(valor, this.area.id)
            : []
        )
      )
      .subscribe((conceptos) => {
        this.conceptosFiltrados = conceptos;
       
      });
  }

  public calcularRangos(): void {
    if (this.area && this.buscarPorArea) {
      console.log(['Buscando por área', this.area]);
      return this.buscarPreciosPorArea(this.area.id);
      
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
        console.log(this.lista);
      });
  }
  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }
}
