import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VentaConceptosService } from '../../services/venta-conceptos.service';
import { VentaConceptos } from '../../models/venta-conceptos';
import { DIRECCION_CORREO_CONS, RESULTS_URL } from 'src/app/config/app';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { MedicoService } from '../../services/medico.service';
import { Medico } from '../../models/medico';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { OrdenVentaService } from '../../services/orden-venta.service';
import { OrdenVenta } from 'src/app/models/orden-venta';

@Component({
  selector: 'app-enviar-estudio',
  templateUrl: './enviar-estudio.component.html',
  styleUrls: ['./enviar-estudio.component.css']
})
export class EnviarEstudioComponent implements OnInit {

  titulo: string = '';
  estudio: VentaConceptos;

  autocompleteControlMedicoReferente = new FormControl();
  medicosReferentesFiltrados: Medico[] = [];


  constructor(private route: ActivatedRoute,
    private service: VentaConceptosService,
    private medicoService: MedicoService,
    private ordenVentaService: OrdenVentaService) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idPacs: string = params.get('idPacs');
      if (idPacs) {
        this.service.buscarPorIdPacs(idPacs).subscribe(estudio => {
          this.estudio = estudio;
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

  enviarCorreo(): void{
    if(this.datosValidos()){
      const subject = `${this.estudio.paciente.nombreCompleto} | Diagnocons ha enviado un estudio`;

      const body = `${this.estudio.mensaje ? this.estudio.mensaje : ''}
      En el enlace adjunto se puede encontrar las distintas opciones para visualizar el estudio,%0D%0A
      como verlo en línea o descargar el estudio completo para ser abierto con el visualizador de su preferencia.%0D%0A %0D%0A
      Si corresponde, también se encuentra la interpretación disponible para visualizar y descargar:%0D%0A %0D%0A
      ${RESULTS_URL}${this.estudio.idPacs}`;

      let enlace = `mailto:${this.estudio.ordenVenta.medicoReferente.correo}?`
       

      if(this.correoPacienteIngresado()){
        enlace = enlace + `cc=${this.estudio.paciente.email}&`;
      }

      enlace +=  `bcc=${DIRECCION_CORREO_CONS}&subject=${subject}&body=${body}`;

     
      window.location.href = enlace;
      console.log(enlace);
    }
  }

  
  datosValidos(): boolean{
    if(this.estudio.ordenVenta.medicoReferente.correo === ''){
      return false;
    }
    if(!this.estudio.ordenVenta.medicoReferente.correo){
      return false;
    }
    return true;
  }

  correoPacienteIngresado(): boolean {
    if(this.estudio.paciente.email === ''){
      return false;
    }
    if(!this.estudio.paciente.email){
      return false;
    }
    return true;
  }

  seleccionarMedicoReferente(event: MatAutocompleteSelectedEvent): void {
    const referente = event.option.value as Medico;

    this.estudio.ordenVenta.medicoReferente = referente;

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

  mostrarNombreMedicoReferente(medico?: Medico): string {
    return medico ? `${medico.nombres} ${medico.apellidos}` : '';
  }
}
