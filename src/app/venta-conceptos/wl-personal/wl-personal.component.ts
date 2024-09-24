import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { CommonListarComponent } from 'src/app/components/common-listar.component';
import { BuscarEstudioModalComponent } from 'src/app/components/studies/buscar-estudio-modal/buscar-estudio-modal.component';
import { EnviarEstudioModalComponent } from 'src/app/components/studies/enviar-estudio-modal/enviar-estudio-modal.component';
import { InformacionEstudioModalComponent } from 'src/app/components/studies/informacion-estudio-modal/informacion-estudio-modal.component';
import { BASE_SITE, VIEWER, WEASIS_VIEWER_PATH } from 'src/app/config/app';
import { Area } from 'src/app/models/area';
import { Paciente } from 'src/app/models/paciente';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AreasService } from 'src/app/services/areas.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';
import { AntecedentesEstudioModalComponent } from '../venta-conceptos/antecedentes-estudio-modal/antecedentes-estudio-modal.component';
import { EnviarEstudioDicomComponent } from '../venta-conceptos/enviar-estudio-dicom/enviar-estudio-dicom.component';
import { TurneroService } from 'src/app/turnero/services/turnero.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-wl-personal',
  standalone: false,
  templateUrl: './wl-personal.component.html',
  styleUrl: './wl-personal.component.css'
})
export class WlPersonalComponent 
extends CommonListarComponent<VentaConceptos, VentaConceptosService>
implements OnInit{
  modalidades: string[] = [];
  estudiosOriginales: VentaConceptos[] = [];

  @ViewChild('modalidadSelect') modalidadSelect: MatSelect;

  constructor(
    service: VentaConceptosService,
    @Inject(AreasService) private areasService: AreasService,
    public dialog: MatDialog,
    private turneroService: TurneroService
  ) {
    super(service);
    this.titulo = 'Listado de estudios';
    this.nombreModel = 'Estudio';
  }

  override ngOnInit(): void {
    this.buscarModalidades();
    this.buscarWlPersonal();
  }

  private buscarWlPersonal(): void {
    this.turneroService.findStudiesIdsWhereUserProcessingEqualsUserInToken().pipe(
      switchMap(ids => this.service.encontrarPorIds(ids))
    ).subscribe(estudios => {
      this.lista = estudios;
      this.estudiosOriginales = [ ...estudios ];
    });
  }
  
  ver(estudio: VentaConceptos): void {
    window.open(`${VIEWER}${estudio.iuid}`);
  }

  abrirWeasis(estudio: VentaConceptos): void {
    window.open(`${WEASIS_VIEWER_PATH}${estudio.iuid}`);
  }

  mostrarNombre(area?: Area): string {
    return area ? area.nombre : '';
  }

  mostrarNombrePaciente(paciente?: Paciente): string {
    return paciente ? paciente.nombreCompleto : '';
  }


  buscarEstudioEnPacs(estudio: VentaConceptos): void {
    this.service.buscarEnPacs(estudio.id).subscribe(
      (estudioConIuid) => {
        console.log('Id pacs encontrado en el sistema');
        Swal.fire(
          'Encontrado',
          'Se vinculó el estudio automáticamente',
          'success'
        );
        estudio = estudioConIuid;
      },
      (e) => {
        if (e.status === 404) {
          this.dialog.open(BuscarEstudioModalComponent, {
            width: '1500px',
            data: { estudio: estudio },
          });
        }
      }
    );
  }

  abrirEnvio(estudio: VentaConceptos): void {
    const modalRef = this.dialog.open(EnviarEstudioModalComponent, {
      width: '1000px',
      data: { estudio: estudio },
    });

    modalRef.afterClosed().subscribe(
      (enviado) => {
        if (enviado) {
          Swal.fire('Enviado', 'Se ha enviado el estudio con éxito', 'success');
          estudio.estado = enviado.estado;
        }
      },
      (e) => {}
    );
  }

  abrirInformacion(estudio: VentaConceptos): void {
    const modalRef = this.dialog.open(InformacionEstudioModalComponent, {
      width: '1000px',
      data: { estudio: estudio },
    });

    modalRef.afterClosed().subscribe((info) => {});
  }

  abrirAntecedentes(estudio: VentaConceptos): void {
    const modalRef = this.dialog.open(AntecedentesEstudioModalComponent, {
      width: '1000px',
      data: { estudio: estudio },
    });

    modalRef.afterClosed().subscribe((info) => {});
  }

  abrirQr(estudio: VentaConceptos) {
    this.service.verEtiqueta(estudio.id).subscribe((res) => {
      console.log(res);
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  desvincular(estudio: VentaConceptos) {
    if (estudio.estado === 'INTERPRETADO') {
      Swal.fire({
        icon: 'error',
        title: 'No se puede desvincular',
        text: `el estudio de ${estudio.paciente.nombre} ya esta interpretado.`,
        background: 'black',
        toast: true,
        color: 'white',
        confirmButtonText: 'Cerrar',
        position: 'bottom-end',
      });
      return;
    }
    Swal.fire({
      title: '¿Desea desvincular el estudio?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Éxito', 'El estudio ha sido desvinculado', 'success');
        estudio.iuid = '';
        this.actualizarEstudio(estudio);
      }
    });
  }

  seleccionarModalidad(event) {
    const modalidad = event.value as string;
    if (modalidad === 'TODAS') {
      this.lista = [...this.estudiosOriginales];
    } else {
      this.filtrarPorModalidad(modalidad);
    }
  }

  actualizarEstudio(estudio: VentaConceptos) {
    this.service.editar(estudio).subscribe(
      (actualizado) => {
        console.log('Actualizado');
      },
      (error) => {
        Swal.fire(
          'Error',
          'Ocurrió un error al desvincular\nVuelva a intentarlo',
          'error'
        );
      }
    );
  }

  verMasInfo(estudio: VentaConceptos) {
    estudio.verMasInfo = !estudio.verMasInfo;
  }

  verQr(estudio: VentaConceptos): void {
    let ordenVentaId = estudio.ordenVenta.id;
    let pacienteId = estudio.paciente.id;
    let url = `${BASE_SITE}/resultados/orden/${ordenVentaId}/${pacienteId}`;
    // window.location.href = url;
    window.open(url);
  }

  private buscarModalidades() {
    this.areasService.listar().subscribe((areas) => {
      this.modalidades = areas
        .map((a) => a.nombre)
        .filter((a) => this.esModalidad(a));
      this.modalidades.unshift('TODAS');
    });
  }

  private esModalidad(nombre: string): boolean {
    if (nombre == 'ANESTESIA') {
      return false;
    }
    if (nombre == 'DIAGNOKINES') {
      return false;
    }
    if (nombre == 'IMPRESION') {
      return false;
    }
    if (nombre == 'PAQUETES') {
      return false;
    }
    if (nombre == 'TAC COVID') {
      return false;
    }
    return true;
  }

  private filtrarPorModalidad(modalidad: string) {
    this.lista = this.estudiosOriginales.filter(
      (estudio) => estudio.concepto.area.nombre == modalidad
    );
  }


  enviar(estudio: VentaConceptos): void {
    this.service.procesarEstudioEnWorklist(estudio.id).subscribe(
      () => {
        estudio.enWorklist = true;
        Swal.fire('Éxito', 'Procesado correctamente', 'success');
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'No se ha podido procesar la worklist', 'error');
      }
    );
  }

  abrirEnvioDicom(estudio) {
    const modalRef = this.dialog.open(EnviarEstudioDicomComponent, {
      width: '1000px',
      data: { estudio: estudio },
    });

    modalRef.afterClosed().subscribe((info) => {});
  }
}