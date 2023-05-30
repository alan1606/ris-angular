import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import Swal from 'sweetalert2'
import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

@Component({
  template: ''
})
export abstract class CommonListarComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  lista: E[];
  titulo: string;
  protected nombreModel: string;

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(CommonService) protected service: S) { }

  ngOnInit(): void {
    this.calcularRangos();
  }

  public eliminar(e: E): void {

    Swal.fire({
      title: 'Cuidado',
      text: `¿Seguro que desea elminar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(e.id).subscribe(() => {
          this.calcularRangos();
          Swal.fire('Eliminado:', `${this.nombreModel} eliminado con éxito`, "success");
        });
      }
    })
  }


  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }

  public calcularRangos(): void {
    this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(p => {
      this.lista = p.content as E[];
      this.totalRegistros = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
    });
  }

}
