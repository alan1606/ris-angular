import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, flatMap } from 'rxjs/operators';
import { VIEWER } from 'src/app/config/app';
import { Area } from 'src/app/models/area';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AreasService } from 'src/app/services/areas.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';
import { CommonListarComponent } from '../common-listar.component';


@Component({
  selector: 'app-venta-conceptos',
  templateUrl: './venta-conceptos.component.html',
  styleUrls: ['./venta-conceptos.component.css']
})
export class VentaConceptosComponent extends CommonListarComponent<VentaConceptos, VentaConceptosService> implements OnInit {

  autocompleteControl = new FormControl();
  areasFiltradas: Area [] = [];

  constructor(service : VentaConceptosService, 
    @Inject(AreasService) private areasService: AreasService) { 
    super(service);
    this.titulo = "Listado de estudios";
    this.nombreModel = "Estudio";
  }

  override ngOnInit(): void {
      super.ngOnInit();
      this.autocompleteControl.valueChanges.pipe(
        map(valor => typeof valor === 'string' ? valor : valor.nombre ),
        flatMap(valor => valor? this.areasService.filtrarPorNombre(valor): [])
        ).subscribe(areas => this.areasFiltradas = areas);
  }

  buscarEnPacs(estudio: VentaConceptos): void {
        this.service.buscarEnPacs(estudio.id).subscribe(() =>{
          this.calcularRangos();
        },
        e =>{
          if(e.status === 404){
            Swal.fire(
              'Error', 'No se encontró el esutudio', 'error' 
             );
          }
        });
  }

  ver(estudio: VentaConceptos): void{
    window.open(`${VIEWER}/${estudio.iuid}`);
  }

}
