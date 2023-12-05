import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { switchMap, catchError, tap, mergeMap, map } from 'rxjs/operators';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { Area } from 'src/app/models/area';
import { AreasService } from 'src/app/services/areas.service';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-confirmar-cita-paciente',
  templateUrl: './confirmar-cita-paciente.component.html',
  styleUrls: ['./confirmar-cita-paciente.component.css']
})
export class ConfirmarCitaPacienteComponent implements OnInit {

  titulo: string;
  orden: OrdenVenta;
  private pacienteId: number;
  estudios: VentaConceptos[] = [];
  private areasIds: number[];
  areas: Area[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenVentaService: OrdenVentaService,
    private ventaConceptosService: VentaConceptosService,
    private areasService: AreasService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params) => this.handleRouteParams(params)),
      switchMap((orden) => this.handleOrdenResponse(orden))
    ).subscribe(
      () => {},
      (error) => console.log(error)
    );
  }

  private handleRouteParams(params: any): Observable<OrdenVenta | null> {
    const ordenId = +params.get('idOrden');
    this.pacienteId = +params.get('idPaciente');
    if (!ordenId || !this.pacienteId) {
      return of(null);
    }

    return this.ordenVentaService.ver(ordenId).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  private handleOrdenResponse(orden: OrdenVenta): Observable<void> {
    if (!orden || (orden.paciente.id !== this.pacienteId)) {
      this.router.navigate(['/']);
      return of(null);
    } else {
      this.orden = orden;
      this.titulo = `Confirmar cita de ${this.orden.paciente.nombreCompleto}`;

      return this.ventaConceptosService.encontrarPorOrdenVentaId(this.orden.id).pipe(
        tap(estudios => {
          this.estudios = estudios;
          this.areasIds = estudios.map(estudio => estudio.concepto.area.id);
        }),
        mergeMap(() => this.areasService.obtenerAreasPorId(this.areasIds)),
        tap(areas => {
          this.areas = areas;
        }),
        catchError((error) => {
          console.log(error);
          return of(null);
        }),
        // Aquí se puede utilizar el operador map para devolver `void`
        map(() => null)
      );
    }
  }
}