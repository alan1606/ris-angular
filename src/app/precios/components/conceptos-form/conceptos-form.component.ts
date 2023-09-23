import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFormComponent } from 'src/app/components/common-form.component';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { ConceptosService } from 'src/app/services/conceptos.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { flatMap, map, mergeMap } from 'rxjs';
import { AreasService } from 'src/app/services/areas.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PreciosService } from '../../services/precios.service';

@Component({
  selector: 'app-conceptos-form',
  templateUrl: './conceptos-form.component.html',
  styleUrls: ['./conceptos-form.component.css']
})

export class ConceptosFormComponent  {
  titulo: string;
  model: Concepto;
  error: any;
  area: Area;
  precio: number = 0;

  autocompleteControlArea = new FormControl();
  areasFiltradas: Area[] = [];

  private redirect: string;
  private nombreModel: string;

  constructor(
    private service: ConceptosService,
    private areaService: AreasService,
    private preciosService: PreciosService,
    private router: Router,
    private route: ActivatedRoute) {
      
    this.titulo = "Crear conceptos";
    this.model = new Concepto();
    this.redirect = '/precios';
    this.nombreModel = Concepto.name;
   
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(model => {
          this.model = model;
          this.buscarPrecio();
        });
      }
    });

    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areaService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => {
      this.areasFiltradas = areas;
    });
  }


  public crear() : void{
    this.service.crear(this.model).subscribe(model =>{
      console.log(model);
      Swal.fire('Nuevo:' , `${this.nombreModel} creado con éxito`, 'success');
      this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  public editar() : void{
    this.service.editar(this.model).subscribe(concepto =>{
      console.log(concepto);
      Swal.fire('Modificado: ' , `${this.nombreModel} actualizado con éxito`, "success");
      this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent){
    this.area = event.option.value as Area;

    event.option.deselect();
    event.option.focus();
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  private buscarPrecio(){
    this.preciosService.buscarPrecioDeConcepto(this.model).subscribe(precio => {
      this.precio = precio.precio ? precio.precio : 0;
    });
  }
}
