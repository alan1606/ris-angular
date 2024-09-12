import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { TokenService } from 'src/app/services/token.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { mergeMap, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { InstitucionService } from 'src/app/services/institucion.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-enviar-resultados',
  templateUrl: './enviar-resultados.component.html',
  styleUrls: ['./enviar-resultados.component.css'],
})
export class EnviarResultadosComponent implements OnInit {
  constructor(
    private ordenVentaService: OrdenVentaService,
    private ventaConceptosService: VentaConceptosService,
    private tokenService: TokenService,
    private router: Router,
    private institucionService: InstitucionService,
    @Inject(MAT_DIALOG_DATA) private dataInject?: any
  ) {}

  orden: OrdenVenta;
  correo: string;
  private institucionId: number;
  date = new FormControl();
  deshabilitado: boolean = false;

  ngOnInit(): void {
    this.deshabilitado = false;
    const user = this.tokenService.getUsername();

    if (!this.dataInject.idPacs && this.dataInject.id) {
      const id: number = this.dataInject.id;

      this.ordenVentaService
        .ver(id)
        .pipe(
          mergeMap((orden) => {
            this.orden = orden;
            this.correo = orden.medicoReferente.correo;
            return this.ventaConceptosService.encontrarPorOrdenVentaId(id);
          }),
          mergeMap((estudios) => {
            const usuarioInstitucion = estudios[0]?.institucion?.usuario;
            if (usuarioInstitucion !== user) {
              return of(null); // Devuelve un observable que emite un valor nulo para completar la cadena.
            }
            this.institucionId = estudios[0]?.institucion?.id;
            return of(null); // Devuelve un observable que emite un valor nulo para continuar con el siguiente bloque.
          })
        )
        .subscribe(
          () => {},
          (error) => {
            console.log(error);
          }
        );
    }
    if (this.dataInject.idPacs) {
      console.log(this.dataInject);
      this.orden = this.dataInject.ordenVenta;
      this.correo = this.dataInject.ordenVenta.medicoReferente.correo;
      this.institucionId = this.dataInject.institucion.id;
    }
    // });
  }

  enviarResultados(): void {
    this.correo = this.correo.trim();
    if (!this.datosValidos()) {
      Swal.fire('Error', 'Por favor, complete los campos requeridos', 'error');
      return;
    }
    this.deshabilitado = true;
    this.institucionService
      .enviarResultadosAMedicoReferente(
        this.institucionId,
        this.orden.id,
        this.correo
      )
      .subscribe(
        (orden) => {
          console.log(orden);
          Swal.fire('Enviado', 'Se ha enviado el estudio', 'success');
          this.deshabilitado = false;
          if (this.tokenService.isInstitution()) {
            this.router.navigate(['/instituciones']);
          }
          return;
        },
        (error) => {
          console.log(error);
          Swal.fire(
            'Error',
            'Ha ocurrido un error al enviar el estudio',
            'error'
          );
          this.deshabilitado = false;
        }
      );
  }

  private datosValidos(): boolean {
    return this.correo != null && this.correo != '';
  }
}
