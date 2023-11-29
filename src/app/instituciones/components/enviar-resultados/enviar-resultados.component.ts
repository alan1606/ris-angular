import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { TokenService } from 'src/app/services/token.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { map, mergeMap, of } from 'rxjs';
import { Medico } from 'src/app/models/medico';
import { FormControl } from '@angular/forms';
import { MedicoService } from 'src/app/services/medico.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { format } from 'date-fns-tz';


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
    private medicoService: MedicoService,
    private institucionService: InstitucionService,
    private pipe: DatePipe
  ) {
    this.medico = new Medico();
  }

  orden: OrdenVenta;
  medico: Medico;
  seVaARegistrarUnNuevoMedico: boolean = false;
  medicoVieneDesdeOrdenVenta: boolean = false;
  seSeleccionoMedico: boolean = false;
  medicosFiltrados: Medico[] = [];
  autocompleteControlMedicoReferente = new FormControl();
  private institucionId: number;
  date = new FormControl();

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id: number = +params.get('ordenId');
      const user = this.tokenService.getUsername();
      if (id) {
        this.ordenVentaService
          .ver(id)
          .pipe(
            mergeMap((orden) => {
              this.orden = orden;
              return this.ventaConceptosService.encontrarPorOrdenVentaId(id);
            }),
            mergeMap((estudios) => {
              const usuarioInstitucion = estudios[0]?.institucion?.usuario;
              if (usuarioInstitucion !== user) {
                this.router.navigate(['/']);
                return of(null); // Devuelve un observable que emite un valor nulo para completar la cadena.
              }
              if (this.orden.medicoReferente.nombres !== 'SIN MEDICO REFERENTE') {
                this.medico = this.orden.medicoReferente;
                this.medicoVieneDesdeOrdenVenta = true;
              }
              if (this.medico?.fechaNacimiento) {
                const fechaEstatica = new Date(this.medico.fechaNacimiento);
                const fechaCorregida = new Date(fechaEstatica.getTime() + fechaEstatica.getTimezoneOffset() * 60000);
                this.date.setValue(fechaCorregida);
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

    this.autocompleteControlMedicoReferente.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombres)),
        mergeMap((valor) =>
          valor ? this.medicoService.filtrarReferentesPorNombre(valor) : []
        )
      )
      .subscribe((medicos) => (this.medicosFiltrados = medicos));
  }

  habilitarRegistroMedico() {
    this.seVaARegistrarUnNuevoMedico = true;
  }

  mostrarMedicoReferente(medico?: Medico): string {
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
  }

  seleccionarMedicoReferente(event): void {
    console.log(event);
    this.medico = event.option.value as Medico;

    console.log(this.medico);

    this.seSeleccionoMedico = true;
    event.option.deselect();
    event.option.focus();
  }

  enviarResultados(): void {
    if (!this.datosValidos()) {
      Swal.fire("Error", "Por favor, complete los campos requeridos", "error");
      return;
    }
    this.orden.medicoReferente = this.medico;
    this.institucionService.enviarResultadosAMedicoReferente(this.institucionId, this.orden.id, this.orden).subscribe(
      orden => {
        console.log(orden);
      },
      error => {
        console.log(error);
      }
    );
  }

  private datosValidos(): boolean {
    if (!this.medico?.nombres || this.medico?.nombres == '') {
      console.log("MALNOMBRE");
      return false;
    }
    if (!this.medico?.apellidos || this.medico?.apellidos == '') {
      console.log("MALAPELLIDO");
      return false;
    }
    if (!this.medico?.correo || this.medico?.correo == '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.medico?.correo)) {
      console.log("MALCORREO");
      return false;
    }
    return true;
  }

  nombreAMayusculas() {
    this.medico.nombres = this.medico.nombres.toUpperCase();
  }

  apellidosAMayusculas() {
    this.medico.apellidos = this.medico.apellidos.toUpperCase();
  }

  especialidadAMayusculas() {
    this.medico.especialidad = this.medico.especialidad.toUpperCase();
  }

  public actualizarFecha(fecha: HTMLInputElement) {
    this.medico.fechaNacimiento = this.pipe.transform(new Date(fecha.value), 'yyyy-MM-dd');
  };
}
