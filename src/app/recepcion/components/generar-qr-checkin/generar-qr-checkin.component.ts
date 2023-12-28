import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxQrcodeElementTypes } from '@techiediaries/ngx-qrcode';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';

@Component({
  selector: 'app-generar-qr-checkin',
  templateUrl: './generar-qr-checkin.component.html',
  styleUrls: ['./generar-qr-checkin.component.css']
})
export class GenerarQrCheckinComponent implements OnInit {

  titulo: string = "";
  private pacienteId: number;
  orden: OrdenVenta;
  textoQr: string;
  elementType =  NgxQrcodeElementTypes.URL;
  mensaje: string= '';
  constructor(
    private route: ActivatedRoute,
    private ordenVentaService: OrdenVentaService,
    private router: Router
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
    } else {
      this.orden = orden;
      this.titulo = `Qr de ${this.orden.paciente.nombreCompleto}`;
      this.textoQr = `${this.orden.paciente.id},${this.orden.id}`;
      this.mensaje = "Presente este código en recepción para ingresar a su cita"
    }
    return of(null);
  }
}
