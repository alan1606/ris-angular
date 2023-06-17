import { Component, OnInit, ViewChild } from '@angular/core';
import { Campania } from '../../models/campania';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CampaniaService } from '../../services/campania.service';

@Component({
  selector: 'app-ver-campanias',
  templateUrl: './ver-campanias.component.html',
  styleUrls: ['./ver-campanias.component.css']
})
export class VerCampaniasComponent implements OnInit {

  titulo: string = "Campañas";
  lista: Campania[] = [];

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  estados:string[] = ['ACTIVO', 'INACTIVO'];
  estado:string;

  constructor(
    private service: CampaniaService
  ) { }

  ngOnInit(): void {
    this.cargarCampanias();
  }


  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.cargarCampanias();
  }


  cargarCampanias() {
      this.service.buscarTodo(this.paginaActual.toString(), this.totalPorPagina.toString())
        .subscribe(p => {
          this.lista = p.content as Campania[];
          this.totalRegistros = p.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros:';
          console.log(this.lista);
        });
  }

}
