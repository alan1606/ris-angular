import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonListarComponent } from 'src/app/components/common-listar.component';
import { Concepto } from '../../models/concepto';
import { PreciosService } from '../../services/precios.service';
import { Area } from 'src/app/models/area';
import { FormControl } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { map, flatMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent extends CommonListarComponent<Concepto, PreciosService>{

  area: Area;
  areasFiltradas: Area[] = [];
  private nombreConcepto = "";

  buscarPorArea = false;

  @ViewChild('nombreBuscar') nombreBuscar: ElementRef;

  autocompleteControl = new FormControl();


  constructor(
    service: PreciosService,
    private areasService: AreasService
  ) { 
    super(service);
    this.titulo = "Tabulador de precios";
  }

  public override ngOnInit(): void {
    this.calcularRangos();

    this.autocompleteControl.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      flatMap(valor => valor ? this.areasService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => this.areasFiltradas = areas);

  }

  public override calcularRangos(): void {
  //Se me ocurre que aquí puedo poner ifs para saber hacia qué service paginar

  if(this.nombreConcepto && this.nombreConcepto != "" && !this.buscarPorArea ){
    console.log(["Buscando por nombre", this.nombreConcepto]);
    //buscarPorNombre(nombreBuscar);
    //this.nombreBuscar.nativeElement.value = "";
    return;
  }

  if(this.area && this.buscarPorArea){
    console.log(["Buscando por área", this.area]);
    //buscarPorArea(area);
  }
/*
    this.service.listarPaginas(this.paginaActual.toString(), this.totalPorPagina.toString()).subscribe(p => {
      this.lista = p.content as E[];
      this.totalRegistros = p.totalElements as number;
      this.paginator._intl.itemsPerPageLabel = 'Registros:';
    });*/


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
}
