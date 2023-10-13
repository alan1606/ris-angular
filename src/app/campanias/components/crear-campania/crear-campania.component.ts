import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { Campania } from '../../models/campania';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaniaService } from '../../services/campania.service';
import Swal from 'sweetalert2';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Area } from 'src/app/models/area';
import { Concepto } from '../../models/concepto';
import { map, mergeMap } from 'rxjs';
import { AreasService } from 'src/app/services/areas.service';
import { ConceptosService } from 'src/app/services/conceptos.service';


@Component({
  selector: 'app-crear-campania',
  templateUrl: './crear-campania.component.html',
  styleUrls: ['./crear-campania.component.css']
})
export class CrearCampaniaComponent implements OnInit {

  titulo = "Crear campaña";
  campania: Campania = new Campania();
  error: any;


  fechaInicioControl = new FormControl();
  fechaFinControl = new FormControl();

  autocompleteControlArea = new UntypedFormControl();
  autocompleteControlConcepto = new UntypedFormControl();


  area: Area;
  concepto: Concepto;

  areasFiltradas: Area[] = [];
  conceptosFiltrados: Concepto[] = [];
  estudios: Concepto[] = [];


  constructor(
    private service: CampaniaService,
    private pipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private areaService: AreasService,
    private conceptoService: ConceptosService
  ) {
    this.campania.activa = true;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if (id) {
        this.service.ver(id).subscribe(
          campania => {
            this.campania = campania;

            this.fechaInicioControl.setValue(this.fechaSqlADate(campania.fechaInicio));
            this.fechaFinControl.setValue(this.fechaSqlADate(campania.fechaFin));
          },
          () => this.router.navigate(['/campanias'])
        );
      }
    });

    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areaService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => {
      this.areasFiltradas = areas;
      this.autocompleteControlConcepto.setValue("");
      this.conceptosFiltrados = [];
      this.concepto = null;
    });


    this.autocompleteControlConcepto.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.concepto),
      mergeMap(valor => valor && this.area?.id ? this.conceptoService.buscarLikeNombreEnArea(valor, this.area.id) : [])
    ).subscribe(conceptos => {
      this.conceptosFiltrados = conceptos;
    });


  }

  private fechaSqlADate(fecha: string): Date {
    const partesFecha = fecha.split('-');
    return new Date(+partesFecha[0], +partesFecha[1] - 1, +partesFecha[2]);
  }


  editar(): void {
    this.service.editar(this.campania).subscribe(concepto => {
      console.log(concepto);
      Swal.fire('Modificado: ', `Campaña actualizada con éxito`, "success");
      this.router.navigate(['/campanias']);
    }, err => {
      if (err.status === 400) {
        this.error = err.error;
        if (this.error.detail)
          Swal.fire("Fechas", "No se puede poner una fecha de fin anterior a la de inicio", "error");
      }
    });

  }

  crear(): void {
    this.service.crear(this.campania).subscribe(model => {
      console.log(model);
      Swal.fire('Nuevo:', `Campaña creada con éxito`, 'success');
      this.router.navigate(['/campanias']);
    }, err => {
      if (err.status === 400) {
        this.error = err.error;
        if (this.error.detail)
          Swal.fire("Fechas", "No se puede poner una fecha de fin anterior a la de inicio", "error");
      }
    });

  }


  datosValidos(): boolean {
    if (this.campania.nombre == '') {
      return false;
    }
    if (this.campania.fechaInicio == '') {
      return false;
    }
    if (this.campania.fechaFin == '') {
      return false;
    }
    if (this.campania.codigo == '') {
      return false;
    }
    if (this.campania.descripcion == '') {
      return false;
    }
    return true;
  }

  seleccionarFechaInicio(fecha: HTMLInputElement): void {
    const fechaFormulario = this.pipe.transform(new Date(fecha.value), 'dd-MM-yyyy');
    this.campania.fechaInicio = this.pipe.transform(new Date(fecha.value), 'yyyy-MM-dd');
  }

  seleccionarFechaFin(fecha: HTMLInputElement): void {
    const fechaFormulario = this.pipe.transform(new Date(fecha.value), 'dd-MM-yyyy');
    this.campania.fechaFin = this.pipe.transform(new Date(fecha.value), 'yyyy-MM-dd');
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent) {
    this.area = event.option.value as Area;

    event.option.deselect();
    event.option.focus();
  }

  seleccionarConcepto(event: MatAutocompleteSelectedEvent): void {
    this.concepto = event.option.value as Concepto;


    //Busco el concepto en el backend para traer su precio
    this.conceptoService.ver(this.concepto.id).subscribe(concepto => {
      this.concepto = concepto;
      this.estudios = this.unirConceptos(this.estudios, [this.concepto]);
    });


    this.autocompleteControlConcepto.setValue("");
    event.option.deselect();
    event.option.focus();
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  mostrarNombreConcepto(concepto?: Concepto): string {
    return concepto ? concepto.concepto : '';
  }

  reiniciarArea() {
    const textoIngresado = this.autocompleteControlArea.value;
    const areaEncontrada = this.areasFiltradas.find(area => area.nombre === textoIngresado);

    if (!areaEncontrada) {
      this.area = null;
    }
  }

  seleccionarTodosEstudios(event) {
    const checkbox = event.target as HTMLInputElement;
    const seleccionado = checkbox.checked;

    if (seleccionado) {
      this.conceptoService.listar().subscribe(conceptos => {
        this.estudios = this.unirConceptos(this.estudios, conceptos);
      });
    }
  }

  seleccionarTodosEstudiosDeArea(event) {
    const checkbox = event.target as HTMLInputElement;
    const seleccionado = checkbox.checked;

    if (seleccionado) {
      this.conceptoService.buscarPorArea(this.area).subscribe(conceptos => {
        this.estudios = this.unirConceptos(this.estudios, conceptos);
      });
    }
  }

  quitar(concepto: Concepto) {
    this.estudios = this.estudios.filter(estudio => estudio.id != concepto.id);
  }

  private unirConceptos(conceptos: Concepto[], conceptosUnir: Concepto[]): Concepto[] {
    let res = conceptos.concat(conceptosUnir.filter(concepto => conceptos.map(concepto => concepto.id).indexOf(concepto.id) < 0));
    return res;
  }

  ingresarPorcentaje(event, index: number){
    const valor = parseInt((event.target as HTMLInputElement).value);
    if(isNaN(valor) || valor == null){
      this.estudios[index].porcentajeDescuento = 0;
      this.estudios[index].montoDescuento = 0;
      this.estudios[index].precioDespuesDescuento = this.estudios[index].precio;
      return;
    }
    if(valor < 0 || valor > 100){
      this.estudios[index].porcentajeDescuento = 0;
      this.estudios[index].montoDescuento = 0;
      this.estudios[index].precioDespuesDescuento = this.estudios[index].precio;
      return;
    }

    this.estudios[index].porcentajeDescuento = this.redondear(valor);
    this.estudios[index].montoDescuento = this.redondear(this.estudios[index].precio * (valor) / 100);
    this.estudios[index].precioDespuesDescuento = this.redondear(this.estudios[index].precio * (100-valor) / 100);
  }
   
  ingresarMonto(event, index: number){
    const valor = parseFloat((event.target as HTMLInputElement).value);
    if(isNaN(valor) || valor == null){
      this.estudios[index].porcentajeDescuento = 0;
      this.estudios[index].montoDescuento = 0;
      this.estudios[index].precioDespuesDescuento = this.estudios[index].precio;
      return;
    }
    if(valor < 0 || valor > this.estudios[index].precio){
      this.estudios[index].porcentajeDescuento = 0;
      this.estudios[index].montoDescuento = 0;
      this.estudios[index].precioDespuesDescuento = this.estudios[index].precio;
      return;
    }
    this.estudios[index].porcentajeDescuento =  this.redondear(100 * (valor) / this.estudios[index].precio);
    this.estudios[index].montoDescuento = this.redondear(valor);
    this.estudios[index].precioDespuesDescuento = this.redondear(this.estudios[index].precio - valor);
  }

  private redondear(numero: number): number{
    return Math.round(numero*100) / 100;
  }
}
