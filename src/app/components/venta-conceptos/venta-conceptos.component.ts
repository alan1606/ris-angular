import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, flatMap } from 'rxjs/operators';
import { BASE_ENDPOINT, VIEWER } from 'src/app/config/app';
import { Area } from 'src/app/models/area';
import { Paciente } from 'src/app/models/paciente';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AreasService } from 'src/app/services/areas.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';
import { CommonListarComponent } from '../common-listar.component';
import { BuscarEstudioModalComponent } from '../studies/buscar-estudio-modal/buscar-estudio-modal.component';
import { EnviarEstudioModalComponent } from '../studies/enviar-estudio-modal/enviar-estudio-modal.component';
import { InformacionEstudioModalComponent } from '../studies/informacion-estudio-modal/informacion-estudio-modal.component';
import { AntecedentesEstudioModalComponent } from './antecedentes-estudio-modal/antecedentes-estudio-modal.component';


@Component({
  selector: 'app-venta-conceptos',
  templateUrl: './venta-conceptos.component.html',
  styleUrls: ['./venta-conceptos.component.css']
})
export class VentaConceptosComponent extends CommonListarComponent<VentaConceptos, VentaConceptosService> implements OnInit {

  autocompleteControl = new FormControl();
  autocompleteControlPaciente = new FormControl();
  areasFiltradas: Area[] = [];
  pacientesFiltrados: Paciente[] = [];
  fechaInicio = '';
  fechaFin = '';

  constructor(service: VentaConceptosService,
    @Inject(AreasService) private areasService: AreasService,
    @Inject(PacientesService) private pacienteService: PacientesService,
    private pipe: DatePipe,
    public dialog: MatDialog,
    private router: Router) {
    super(service);
    this.titulo = "Listado de estudios";
    this.nombreModel = "Estudio";
  }

  override ngOnInit(): void {
    this.buscarEstudiosDeHoy();

    this.autocompleteControl.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      flatMap(valor => valor ? this.areasService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => this.areasFiltradas = areas);

    this.autocompleteControlPaciente.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombreCompleto),
      flatMap(valor => valor ? this.pacienteService.filtrarPorNombre(valor) : [])
    ).subscribe(pacientes => this.pacientesFiltrados = pacientes);


  }


  ver(estudio: VentaConceptos): void {
    window.open(`${VIEWER}/${estudio.iuid}`);
  }

  mostrarNombre(area?: Area): string {
    return area ? area.nombre : '';
  }

  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  buscarEstudiosDeHoy(): void {
    this.service.filtrarDiaDeHoy().subscribe(estudios => this.lista = estudios,
      e => {
        if (e.status === 404) {
          this.lista = [];
        }
      });
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent): void {
    const area = event.option.value as Area;

    if(this.errorEnFechas()){
      this.crearRangoDeDosMesesEnBaseAHoy();
    }
  
    this.service.filtrarRangoYArea(this.fechaInicio, this.fechaFin, area.id).subscribe(estudios => {
      this.lista = estudios;
    },
      e => {
        if (e.status === 404) {
          this.lista = [];
        }
      }
    );

    this.autocompleteControl.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    const paciente = event.option.value as Paciente;

    if(this.errorEnFechas()){
      this.crearRangoDeDosMesesEnBaseAHoy();
    }
  
    this.service.filtrarRangoYPaciente(this.fechaInicio, this.fechaFin, paciente.id).subscribe(estudios => {
      this.lista = estudios;
    },
      e => {
        if (e.status === 404) {
          this.lista = [];
        }
      }
    );

    this.autocompleteControlPaciente.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  private errorEnFechas(): boolean{
    return this.fechaInicio === '' || this.fechaFin === '';
  }

  private crearRangoDeDosMesesEnBaseAHoy(): void{
    this.fechaInicio = this.sumarMesesAFechaDeHoy(-1);
    this.fechaFin = this.sumarMesesAFechaDeHoy(1);
    console.log(this.fechaInicio + " " + this.fechaFin);
  }

  private sumarMesesAFechaDeHoy(cantidad: number): string{
    const hoy = new Date(Date.now());
    const sumada = new Date(hoy.getFullYear(), hoy.getMonth() + cantidad, hoy.getDate());
    return this.pipe.transform(sumada, 'yyyy-MM-dd');
  }

 
  buscarPorFecha(fechaInicio: HTMLInputElement, fechaFin: HTMLInputElement): void {
    if (fechaInicio.value !== '' && fechaFin.value !== '') {
      this.fechaInicio = this.pipe.transform(new Date(fechaInicio.value), 'yyyy-MM-dd');
      this.fechaFin = this.pipe.transform(new Date(fechaFin.value), 'yyyy-MM-dd');

      console.log(this.fechaInicio + " " + this.fechaFin)

      this.service.filtrarRango(this.fechaInicio, this.fechaFin).subscribe(estudios => this.lista = estudios,
        e => {
          if (e.status === 404) {
            this.lista = [];
          }
        });
    }
    else{
      this.fechaInicio = '';
      this.fechaFin = '';
    }
  }

  buscarEstudioEnPacs(estudio: VentaConceptos): void {
    this.service.buscarEnPacs(estudio.id).subscribe(estudioConIuid => {
      console.log("Id pacs encontrado en el sistema");
      Swal.fire('Encontrado', 'Se vinculó el estudio automáticamente', 'success');
      estudio = estudioConIuid;
    },
      e => {
        if (e.status === 404) {
          const modalRef = this.dialog.open(BuscarEstudioModalComponent,{
            width: '1000px',
            data: {"estudio": estudio}
          });
      
          modalRef.afterClosed().subscribe(vinculado => {
            console.log(vinculado);
            if(vinculado){
              Swal.fire('Vinculado', 'Se ha vinculado el estudio', 'success');
            }
          });

        }
      });
    }

    abrirEnvio(estudio: VentaConceptos): void{
      const modalRef = this.dialog.open(EnviarEstudioModalComponent,{
        width: '1000px',
        data: {"estudio": estudio}
      });
      
      modalRef.afterClosed().subscribe(enviado => {
        console.log(enviado);
        if(enviado){
          Swal.fire('Enviado', 'Se ha enviado el estudio con éxito', 'success');
        }
      },
      e =>{
        Swal.fire('Error', 'No se ha podido enviar el estudio', 'error');
      });
    }

    abrirInformacion(estudio: VentaConceptos): void{

      const modalRef = this.dialog.open(InformacionEstudioModalComponent,{
        width: '1000px',
        data: {"estudio": estudio}
      });


      modalRef.afterClosed().subscribe(info => {
        console.log(info);
    });
    }


    abrirAntecedentes(estudio: VentaConceptos): void{

      const modalRef = this.dialog.open(AntecedentesEstudioModalComponent,{
        width: '1000px',
        data: {"estudio": estudio}
      });


      modalRef.afterClosed().subscribe(info => {
        console.log(info);
    });
    }


    abrirQr(estudio: VentaConceptos){
      this.service.verEtiqueta(estudio.id).subscribe(res =>{
        const fileURL = URL.createObjectURL(res);
        window.open(fileURL, '_blank');
      });
    }

    desvincular(estudio: VentaConceptos){
      Swal.fire({
        title: '¿Desea desvincular el estudio?',
        showDenyButton: true,
        confirmButtonText: 'Sí',
        denyButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Éxito', 'El estudio ha sido desvinculado', 'success');
          estudio.iuid = '';
          this.actualizarEstudio(estudio);
        }
      })
    }

  actualizarEstudio(estudio: VentaConceptos) {
    this.service.editar(estudio).subscribe(actualizado => {
      console.log('Actualizado');
    }, error => {
      Swal.fire('Error', 'Ocurrió un error al desvincular\nVuelva a intentarlo' , "error");
    });
  }
}
