import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('nombreBuscar') nombreBuscar: ElementRef;


  estados:string[] = ['ACTIVAS', 'INACTIVAS', 'CUALQUIERA'];
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

    this.buscar();
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


  buscar(){
    const nombreBuscar =  this.nombreBuscar.nativeElement.value;

    if(nombreBuscar && this.estado && this.estado != 'CUALQUIERA'){
      this.buscarPorNombreYEstado(nombreBuscar);
      return;
    }
    if(nombreBuscar){
      this.buscarPorNombre(nombreBuscar);
      return;
    }
    if(this.estado  && this.estado != 'CUALQUIERA'){
      this.buscarPorEstado();
      return;
    }

    this.cargarCampanias();
  }

  private buscarPorNombre(nombre:string): void{
    this.service.buscarPorNombre(nombre, this.paginaActual.toString(), this.totalPorPagina.toString())
        .subscribe(p => {
          this.lista = p.content as Campania[];
          this.totalRegistros = p.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros:';
          console.log(this.lista);
        });
  }

  private buscarPorEstado(): void {
    if(this.estado === 'ACTIVAS'){
      this.buscarActivas();
      return;
    }
    this.buscarInactivas();
  }

  private buscarActivas(): void{
    this.service.activas(this.paginaActual.toString(), this.totalPorPagina.toString())
    .subscribe(p => {
      this.lista = p.content as Campania[];
      this.totalRegistros = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
      console.log(this.lista);
    });
  }

  private buscarInactivas(): void{
    this.service.inactivas(this.paginaActual.toString(), this.totalPorPagina.toString())
    .subscribe(p => {
      this.lista = p.content as Campania[];
      this.totalRegistros = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
      console.log(this.lista);
    });
  }

  private buscarPorNombreYEstado(nombre: string): void {
    if(this.estado === 'ACTIVAS'){
      this.buscarActivasPorNombre(nombre);
      return;
    }
    this.buscarInactivasPorNombre(nombre);
  }

  private buscarInactivasPorNombre(nombre: string): void{
    this.service.inactivasPorNombre(nombre,this.paginaActual.toString(), this.totalPorPagina.toString())
    .subscribe(p => {
      this.lista = p.content as Campania[];
      this.totalRegistros = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
      console.log(this.lista);
    });
  }

  private buscarActivasPorNombre(nombre: string): void{
    this.service.activasPorNombre(nombre,this.paginaActual.toString(), this.totalPorPagina.toString())
    .subscribe(p => {
      this.lista = p.content as Campania[];
      this.totalRegistros = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
      console.log(this.lista);
    });
  }

}
