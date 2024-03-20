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
import { ConceptoPrecio } from '../../models/concepto-precio';
import { ConceptoInstitucion } from '../../models/concepto-institucion';
import { InstitucionService } from 'src/app/services/institucion.service';
import { ConceptoInstitucionService } from '../../services/concepto-institucion.service';

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
  codigoPensiones: string;

  autocompleteControlArea = new FormControl();
  areasFiltradas: Area[] = [];

  private redirect: string;
  private nombreModel: string;

  constructor(
    private service: ConceptosService,
    private areaService: AreasService,
    private preciosService: PreciosService,
    private router: Router,
    private route: ActivatedRoute,
    private institucionService: InstitucionService,
    private conceptoInstitucionService: ConceptoInstitucionService) {
      
    this.titulo = "Crear conceptos";
    this.model = new Concepto();
    this.redirect = '/precios';
    this.nombreModel = Concepto.name;
   
  }

  ngOnInit(): void {

    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areaService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => {
      this.areasFiltradas = areas;
    });

    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(model => {
          this.model = model;
          this.autocompleteControlArea.setValue(model.area);
          this.buscarPrecio();
          this.buscarCodigoPensiones();
        });
      }
    });
  }


  public crear() : void{
    if(!this.precio){
      this.precio = 0;
    }

    let conceptoPrecio: ConceptoPrecio = new ConceptoPrecio;
    conceptoPrecio.concepto = this.model;
    conceptoPrecio.precio = this.precio; 

    this.crearCodigoPensiones();

    this.preciosService.crear(conceptoPrecio).subscribe(model =>{
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
    if(!this.precio){
      this.precio = 0;
    }

    let conceptoPrecio: ConceptoPrecio = new ConceptoPrecio;
    conceptoPrecio.concepto = this.model;
    conceptoPrecio.precio = this.precio; 

    this.crearCodigoPensiones();


    this.preciosService.editar(conceptoPrecio).subscribe(concepto =>{
      console.log(concepto);
      Swal.fire('Modificado: ' , `${this.nombreModel} actualizado con éxito`, "success");
      this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
        Swal.fire("Error", err.error.detail, "error");
        this.router.navigate([this.redirect]);
      }
    });
  }


  seleccionarArea(event: MatAutocompleteSelectedEvent){
    this.area = event.option.value as Area;

    this.model.area = this.area;

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

  private crearCodigoPensiones() {
    if(!this.codigoPensiones){
      return;
    }
    let conceptoInstitucion: ConceptoInstitucion = new ConceptoInstitucion();
    conceptoInstitucion.idInterno = this.codigoPensiones;
    conceptoInstitucion.concepto = this.model;

    this.conceptoInstitucionService.crear(conceptoInstitucion).subscribe(
      () => console.log("Concepto institución registrado correctament"),
      () => console.error("Error al registrar concepto institución")
    );

  }

  private buscarCodigoPensiones(){
    this.institucionService.buscarLikeNombre("PENSIONES").subscribe(
      instituciones =>{
        let pensiones = instituciones[0].id;
        this.conceptoInstitucionService.buscar(this.model.id, pensiones).subscribe(
          ci => {
            this.codigoPensiones = ci[0].idInterno;
          },
          () =>{
            console.log("No se pudo obtener el código de pensiones para ese concepto");
          }
        );
      }, () =>{
        console.log("Error buscando pensiones");
      }
    );
  }


}
