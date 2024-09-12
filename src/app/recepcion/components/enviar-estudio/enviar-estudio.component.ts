import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VentaConceptosService } from '../../../services/venta-conceptos.service';
import { VentaConceptos } from '../../../models/venta-conceptos';
import { UntypedFormControl } from '@angular/forms';
import { map } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico';
import { OrdenVentaService } from '../../../services/orden-venta.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { PacientesService } from '../../../services/pacientes.service';
import { SendMailService } from '../../../services/send-mail.service';
import Swal from 'sweetalert2';
import { EnviarWhatsappService } from 'src/app/services/enviar-whatsapp.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-enviar-estudio',
  templateUrl: './enviar-estudio.component.html',
  styleUrls: ['./enviar-estudio.component.css'],
})
export class EnviarEstudioComponent implements OnInit {
  titulo: string = '';
  estudio: VentaConceptos;
  correoMedico: string = '';
  correoPaciente: string = '';
  whatsappPaciente: string = '';
  mensaje: string = '';

  autocompleteControlMedicoReferente = new UntypedFormControl();
  medicosReferentesFiltrados: Medico[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: VentaConceptos,
    public dialogRef: MatDialogRef<EnviarEstudioComponent>,
    private router: Router,
    private service: VentaConceptosService,
    private medicoService: MedicoService,
    private ordenVentaService: OrdenVentaService,
    private pacienteService: PacientesService,
    private mailService: SendMailService,
    private whatsappService: EnviarWhatsappService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.id) {
      let estudio = this.data;
      this.estudio = estudio;
      this.mensaje = estudio.mensaje;
      this.correoMedico = estudio.ordenVenta.medicoReferente.correo;
      this.correoPaciente = estudio.paciente.email;
      this.whatsappPaciente = estudio.paciente.telefono;
      this.titulo = `${this.estudio.institucion.nombre}: ${this.estudio.concepto.concepto} de ${this.estudio.paciente.nombreCompleto}`;
      this.whatsappPaciente = estudio.paciente.telefono;
      this.autocompleteControlMedicoReferente.setValue(
        this.estudio.ordenVenta.medicoReferente
      );
    }

    this.autocompleteControlMedicoReferente.valueChanges
      .pipe(
        map((valor) =>
          typeof valor === 'string'
            ? valor
            : valor.nombres + ' ' + valor.apellidos
        ),
        flatMap((valor) =>
          valor ? this.medicoService.filtrarReferentesPorNombre(valor) : []
        )
      )
      .subscribe(
        (referentes) => (this.medicosReferentesFiltrados = referentes)
      );
  }

  enviarCorreo(): void {
    if (
      this.correoMedicoReferenteIngresado() ||
      this.correoPacienteIngresado()
    ) {
      if (this.estudio.mensaje !== this.mensaje) {
        console.log('Voy a actualizar el estudio');
        this.estudio.mensaje = this.mensaje;
        this.actualizarEstudio();
        return;
      }
      this.enviarCorreoResultados();
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

  seleccionarMedicoReferente(event: Medico): void {
    this.estudio.ordenVenta.medicoReferente = event;
    this.correoMedico = event.correo;

    console.log('seleccionarmedico', event);

    this.actualizarOrdenDeVenta(this.estudio.ordenVenta);
  }

  actualizarOrdenDeVenta(ordenVenta: OrdenVenta) {
    this.ordenVentaService
      .actualizarOrdenVenta(ordenVenta)
      .subscribe((orden) => {
        console.log('actualizando en backend', orden);
      });
  }

  private actualizarEstudio(): void {
    this.service.editar(this.estudio).subscribe(
      (estudio) => {
        this.estudio = estudio;
        this.enviarCorreoResultados();
      },
      (e) => console.log('Error actualizando estudio')
    );
  }

  private enviarCorreoResultados() {
    this.mailService.enviarCorreoResultados(this.estudio).subscribe(
      () => {
        Swal.fire('Enviado', 'Se ha enviado el correo', 'success');
      },
      (e) => {
        console.log(e);
        Swal.fire('Error', 'No se ha podido enviar el correo', 'error');
      }
    );
  }

  mostrarNombreMedicoReferente(medico?: Medico): string {
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
  }

  enviarWhatsapp(): void {
    if (this.whatsappPaciente) {
      if (this.estudio.paciente.telefono !== this.whatsappPaciente) {
        console.log('Voy a actualizar al paciente');
        this.estudio.paciente.telefono = this.whatsappPaciente;
        this.pacienteService.editar(this.estudio.paciente).subscribe(
          () => this.enviarWhatsappBackend(),
          () =>
            Swal.fire(
              'Error',
              'No se ha podido actualizar el número de whatsapp',
              'error'
            )
        );
      } else {
        this.enviarWhatsappBackend();
      }

      this.router.navigate(['/recepcion/enviar-estudios']);
    }
  }

  private enviarWhatsappBackend() {
    this.whatsappService
      .enviarWhatsappResultados(
        this.estudio.ordenVenta.id,
        this.estudio.paciente.id
      )
      .subscribe(
        (res) => {
          Swal.fire('Enviado', 'Se ha enviado el whatsapp', 'success');
        },
        (e) => {
          Swal.fire('Error', 'No se ha podido enviar el whatsapp', 'error');
          console.log(e);
        }
      );
  }
}
