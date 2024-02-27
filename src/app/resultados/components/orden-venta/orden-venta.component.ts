import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenVentaService } from '../../../services/orden-venta.service';
import { OrdenVenta } from '../../../models/orden-venta';
import { InterpretacionService } from '../../../services/interpretacion.service';
import { VentaConceptos } from '../../../models/venta-conceptos';
import { VentaConceptosService } from '../../../services/venta-conceptos.service';

@Component({
  selector: 'app-orden-venta',
  templateUrl: './orden-venta.component.html',
  styleUrls: ['./orden-venta.component.css']
})
export class OrdenVentaComponent implements OnInit {

  ordenVenta: OrdenVenta;
  titulo: string = '';
  estudios: VentaConceptos[] = [];

  constructor(private route: ActivatedRoute,
    private ordenVentaService: OrdenVentaService,
    private router: Router,
    private ventaConceptosService: VentaConceptosService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const ordenId: number = +params.get('ordenId');
      const pacienteId: number = +params.get('pacienteId');

      if (!ordenId && !pacienteId) {
        this.salir();
      }

      this.ordenVentaService.ver(ordenId).subscribe(orden => {
        if (orden.paciente.id !== pacienteId) {
          this.salir();
        }
        this.ordenVenta = orden;
        this.titulo = `${this.ordenVenta.paciente.nombreCompleto}`;
        this.cargarEstudios();
      });
    });
  }

  abrir(estudio: VentaConceptos): void{
    this.router.navigate(['/resultados/', estudio.idPacs]);
  }

  private cargarEstudios(): void {
    this.ventaConceptosService.encontrarPorOrdenVentaId(this.ordenVenta.id).subscribe(estudios =>{
      this.estudios = estudios;
    },error =>{
      console.log("Ha ocurrido un error al cargar estudios");
    });
  }

  private salir(): void{
    this.router.navigate(['/']);
  }

}
