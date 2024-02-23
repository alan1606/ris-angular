import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { TokenService } from 'src/app/services/token.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import {  mergeMap, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { InstitucionService } from 'src/app/services/institucion.service';
import Swal from 'sweetalert2';


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
    private route: ActivatedRoute,
    private router: Router,
    private institucionService: InstitucionService,
  ) {
  }

  orden: OrdenVenta;
  correo: string;
  private institucionId: number;
  date = new FormControl();
  deshabilitado: boolean = false;

  ngOnInit(): void {
    this.deshabilitado = false;

    this.route.paramMap.subscribe((params) => {
      const id: number = +params.get('ordenId');
      const user = this.tokenService.getUsername();
      if (id) {
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
                this.router.navigate(['/']);
                return of(null); // Devuelve un observable que emite un valor nulo para completar la cadena.
              }
              this.institucionId = estudios[0]?.institucion?.id;
              return of(null); // Devuelve un observable que emite un valor nulo para continuar con el siguiente bloque.
            })
          )
          .subscribe(
            () => { },
            (error) => {
              console.log(error);
              this.router.navigate(['/']);
            }
          );
      } else {
        this.router.navigate(['/']);
      }
    });

  
  }


  enviarResultados(): void {
    this.correo = this.correo.trim();
    if (!this.datosValidos()) {
      Swal.fire("Error", "Por favor, complete los campos requeridos", "error");
      return;
    }
    this.deshabilitado = true;
    this.institucionService.enviarResultadosAMedicoReferente(this.institucionId, this.orden.id, this.correo).subscribe(
      orden => {
        console.log(orden);
        Swal.fire("Enviado", "Se ha enviado el estudio", "success");
        this.deshabilitado = false;
        this.router.navigate(['/instituciones']);
      },
      error => {
        console.log(error);
        Swal.fire("Error", "Ha ocurrido un error al enviar el estudio", "error");
      }
    );
  }


  private datosValidos(): boolean{
    return this.correo != null && this.correo != "";
  }
}
