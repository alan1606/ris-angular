import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { switchMap, of, catchError, forkJoin, Observable} from 'rxjs';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { VentaConceptos } from 'src/app/models/venta-conceptos';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordenVentaService: OrdenVentaService,
    private ventaConceptosService: VentaConceptosService
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
      return of(null); // Retorna un observable nulo para evitar el anidamiento innecesario
    }

    return this.ordenVentaService.ver(ordenId).pipe(
      catchError((error) => {
        console.log(error);
        return of(null); // Maneja el error y retorna un observable nulo
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

      // Utilizar forkJoin para manejar múltiples llamadas asíncronas
      return forkJoin([
        this.ventaConceptosService.encontrarPorOrdenVentaId(this.orden.id)
      ]).pipe(
        switchMap(([estudios]) => {
          this.estudios = estudios;
          return of(null);
        }),
        catchError((error) => {
          console.log(error);
          return of(null);
        })
      );
    }
  }
  

}
