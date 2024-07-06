import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonListarComponent } from 'src/app/components/common-listar.component';
import { PreciosService } from '../../services/precios.service';
import { Area } from 'src/app/models/area';
import { FormControl } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { map, flatMap } from 'rxjs/operators';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { ConceptoPrecio } from '../../models/concepto-precio';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ModificarPrecioModalComponent } from '../modificar-precio-modal/modificar-precio-modal.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent{

  lista: ConceptoPrecio[];
  titulo: string;
  area: Area;
  areasFiltradas: Area[] = [];
  private nombreConcepto = "";

  buscarPorArea = false;

  @ViewChild('nombreBuscar') nombreBuscar: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autocompleteControl = new FormControl();

  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(
    private service: PreciosService,
    private areasService: AreasService,
    public dialog: MatDialog,
    private router: Router
  ) { 
    this.titulo = "Tabulador de precios";
  }

  public ngOnInit(): void {
    this.calcularRangos();

    this.autocompleteControl.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      flatMap(valor => valor ? this.areasService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => this.areasFiltradas = areas);

  }

  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.calcularRangos();
  }


  public  calcularRangos(): void {
  //Se me ocurre que aquí puedo poner ifs para saber hacia qué service paginar

  if(this.nombreConcepto && this.nombreConcepto != "" && !this.buscarPorArea ){
    console.log(["Buscando por nombre", this.nombreConcepto]);
    this.buscarPreciosPorNombre(this.nombreConcepto);

    return;
  }

  if(this.area && this.buscarPorArea){
    console.log(["Buscando por área", this.area]);
    this.buscarPreciosPorArea(this.area.id);
    return;
  }

  }


  seleccionarArea(event: MatAutocompleteSelectedEvent): void {
    const area = event.option.value as Area;
    this.area = area;

    console.log(this.area);

    this.buscarPorArea = true;

    this.calcularRangos();

    this.autocompleteControl.setValue('');
    event.option.deselect();
    event.option.focus();
  }
  
  mostrarNombre(area?: Area): string {
    return area ? area.nombre : '';
  }

  buscarPorNombre(){
    this.buscarPorArea = false;

    this.nombreConcepto = this.nombreBuscar?.nativeElement.value;

    this.calcularRangos();
  }

  private buscarPreciosPorNombre(nombreBuscar: string){
    this.service.buscarPorNombre(nombreBuscar, this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(p => {
      this.lista = p.content as ConceptoPrecio[];
      this.totalRegistros = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
      console.log(this.lista);
      this.nombreBuscar.nativeElement.value = "";
    },
    error =>{
      if(error.status == 404){
        Swal.fire('No encontrado', 'No existe el estudio ' + nombreBuscar, 'error');
        this.nombreBuscar.nativeElement.value = "";
      }
    });
  }

  private buscarPreciosPorArea(areaId: number){
    this.service.buscarPorArea(areaId, this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(p =>{
      this.lista = p.content as ConceptoPrecio[];
      this.totalRegistros = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
      console.log(this.lista);
    });
  }

  cambiarPrecio(conceptoPrecio: ConceptoPrecio): void{
    const dialogRef = this.dialog.open(ModificarPrecioModalComponent, {
      width: "400px",
      data: {id: conceptoPrecio.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      //Si hay que actualizar el precio
      if(result !== conceptoPrecio.precio && result){
        this.actualizarPrecio(conceptoPrecio, result);
      }
    });
  }

  private actualizarPrecio(conceptoPrecio: ConceptoPrecio, precioNuevo: number): void{
    this.service.actualizarPrecio(conceptoPrecio, precioNuevo).subscribe(nuevo =>{
      
      console.log(["nuevo", nuevo]);
      conceptoPrecio = nuevo;
      
    },
    error =>{
      if(error.status == 400){
        Swal.fire("Error", error.error.detail, "error");
      }
    });
  }

}
