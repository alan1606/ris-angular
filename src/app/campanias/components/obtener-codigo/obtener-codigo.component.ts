import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaniaService } from '../../services/campania.service';
import { Campania } from '../../models/campania';
import Swal from 'sweetalert2';
import { Persona } from '../../models/persona';

@Component({
  selector: 'app-obtener-codigo',
  templateUrl: './obtener-codigo.component.html',
  styleUrls: ['./obtener-codigo.component.css']
})
export class ObtenerCodigoComponent implements OnInit {

  campania: Campania;

  persona: Persona = {
    nombre: '',
    email: '',
    whatsapp: '',
    suscripcion: true
  }

  constructor(
    private route: ActivatedRoute,
    private service: CampaniaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const codigoBase: string = params.get('codigoBase');
      if (codigoBase) {
        this.service.buscarPorCodigo(codigoBase).subscribe(
          campania => {
            this.campania = campania;
          },
          () => this.router.navigate([''])
        );
      }
    });
  }

  obtenerCodigo() {
    if (!this.datosValidos()) {
      return;
    }
    this.service.obtenerCodigo(this.campania.codigo, this.persona).subscribe(
      () => {
        Swal.fire("¡Felicidades!", "Se ha enviado el código a su correo y whatsapp, preséntelo en recepción para obtener el beneficio", "success");
      },
      () => {
        Swal.fire("Error", "Ha ocurrido un error, favor de reportar el fallo a Diagnocons", "error");
      }
    );
  }

  private datosValidos(): boolean {
    if (!this.persona.nombre) {
      Swal.fire("Error", "Ingrese su nombre", "error");
      return false;
    }
    if (!this.persona.email) {
      Swal.fire("Error", "Ingrese su correo", "error");
      return false;
    }
    if (!this.persona.whatsapp) {
      Swal.fire("Error", "Ingrese su número de whatsapp", "error");
      return false;
    }
    if (this.invalidoWhatsapp()) {
      Swal.fire("Error", "Ingrese correctamente su número de whatsapp", "error");
      return false;
    }
    if (this.invalidoCorreo()) {
      Swal.fire("Error", "Ingrese correctamente su correo", "error");
      return false;
    }
    return true;
  }

  private invalidoWhatsapp(): boolean {
    if (this.persona.whatsapp.length < 10) {
      return true;
    }
    if (this.persona.whatsapp.match(/[a-zA-Z]/)) {
      return true;
    }
    return false;
  }

  private invalidoCorreo(): boolean {
    const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,4}$/;

    if (this.persona.email.match(regexEmail)) {
      return false;
    }
    return true;
  }
}
