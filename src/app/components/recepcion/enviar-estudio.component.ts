import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaConceptosService } from '../../services/venta-conceptos.service';
import { VentaConceptos } from '../../models/venta-conceptos';
import { DIRECCION_CORREO_CONS, RESULTS_URL } from 'src/app/config/app';
import { UntypedFormControl } from '@angular/forms';
import { map } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { MedicoService } from '../../services/medico.service';
import { Medico } from '../../models/medico';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { PacientesService } from '../../services/pacientes.service';
import { SendMailService } from '../../services/send-mail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enviar-estudio',
  templateUrl: './enviar-estudio.component.html',
  styleUrls: ['./enviar-estudio.component.css']
})
export class EnviarEstudioComponent implements OnInit {

  titulo: string = '';
  estudio: VentaConceptos;
  correoMedico: string = '';
  correoPaciente: string = '';
  mensaje: string = '';

  autocompleteControlMedicoReferente = new UntypedFormControl();
  medicosReferentesFiltrados: Medico[] = [];


  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: VentaConceptosService,
    private medicoService: MedicoService,
    private ordenVentaService: OrdenVentaService,
    private pacienteService: PacientesService,
    private mailService: SendMailService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idPacs: string = params.get('idPacs');
      if (idPacs) {
        this.service.buscarPorIdPacs(idPacs).subscribe(estudio => {
          this.estudio = estudio;
          this.mensaje = estudio.mensaje;
          this.correoMedico = estudio.ordenVenta.medicoReferente.correo;
          this.correoPaciente = estudio.paciente.email;
          this.titulo = `${this.estudio.institucion.nombre}: ${this.estudio.concepto.concepto} de ${this.estudio.paciente.nombreCompleto}`;
          this.autocompleteControlMedicoReferente.setValue(this.estudio.ordenVenta.medicoReferente);
        });
      }
    });

    this.autocompleteControlMedicoReferente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombres + " " + valor.apellidos),
      flatMap(valor => valor ? this.medicoService.filtrarReferentesPorNombre(valor) : [])
    ).subscribe(referentes => this.medicosReferentesFiltrados = referentes);
  }

  enviarCorreo(): void {
    if (this.correoMedicoReferenteIngresado() || this.correoPacienteIngresado()) {
      if (this.estudio.paciente.email !== this.correoPaciente) {
        console.log("Voy a actualizar al paciente");
        this.estudio.paciente.email = this.correoPaciente;
        this.actualizarPaciente();
      }
      if (this.estudio.ordenVenta.medicoReferente.correo !== this.correoMedico) {
        console.log("Voy a actualizar al medico referente");
        this.estudio.ordenVenta.medicoReferente.correo = this.correoMedico;
        this.actualizarMedico();
      }
      if (this.estudio.mensaje !== this.mensaje) {
        console.log("Voy a actualizar el estudio");
        this.estudio.mensaje = this.mensaje;
        this.actualizarEstudio();
      }
      this.mailService.enviarCorreoResultados(this.estudio).subscribe(res => {
        Swal.fire('Enviado', 'Se ha enviado el correo', 'success');
      }, e => {
        Swal.fire('Error', 'No se ha podido enviar el correo', 'error');
      });
      this.router.navigate(['/recepcion/enviar-estudios']);

    }
  }


  correoMedicoReferenteIngresado(): boolean {
    if (this.estudio.ordenVenta.medicoReferente.correo === '') {
      return false;
    }
    if (!this.estudio.ordenVenta.medicoReferente.correo) {
      return false;
    }
    return true;
  }

  correoPacienteIngresado(): boolean {
    if (this.estudio.paciente.email === '') {
      return false;
    }
    if (!this.estudio.paciente.email) {
      return false;
    }
    return true;
  }

  seleccionarMedicoReferente(event: MatAutocompleteSelectedEvent): void {
    const referente = event.option.value as Medico;

    this.estudio.ordenVenta.medicoReferente = referente;
    this.correoMedico = referente.correo

    console.log(referente);
    event.option.deselect();
    event.option.focus();

    this.actualizarOrdenDeVenta(this.estudio.ordenVenta);

  }

  actualizarOrdenDeVenta(ordenVenta: OrdenVenta) {
    this.ordenVentaService.actualizarOrdenVenta(ordenVenta).subscribe(orden => {
      console.log(orden);
    });
  }

  private actualizarEstudio(): void {
    this.service.editar(this.estudio).subscribe(estudio => this.estudio = estudio,
      e => console.log("Error actualizando estudio"));
  }

  private actualizarMedico(): void {
    this.medicoService.editar(this.estudio.ordenVenta.medicoReferente).subscribe(medico => console.log("Médico actualizado"),
      e => console.log("Error actualizando médico"));
  }

  private actualizarPaciente(): void {
    this.pacienteService.editar(this.estudio.paciente).subscribe(paciente => console.log("Paciente actualizado"),
      e => console.log("Error al actualizar paciente"));
  }

  mostrarNombreMedicoReferente(medico?: Medico): string {
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
  }
}
