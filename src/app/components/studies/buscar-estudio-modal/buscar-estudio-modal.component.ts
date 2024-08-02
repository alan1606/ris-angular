import { Component, Inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { VIEWER } from 'src/app/config/app';
import { Study } from 'src/app/models/study';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { StudiesService } from 'src/app/services/studies.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-estudio-modal',
  templateUrl: './buscar-estudio-modal.component.html',
  styleUrls: ['./buscar-estudio-modal.component.css'],
})
export class BuscarEstudioModalComponent implements OnInit {
  estudio: VentaConceptos;
  estudios: Study[] = [];
  nombreBuscar: string;
  mostrarColumnasEstudios = [
    'id',
    'fecha',
    'paciente',
    'estudio',
    'idPacs',
    'ver',
    'vincular',
  ];
  totalRegistros = 0;
  paginaActual = 0;
  totalPorPagina = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  estudioVisto = signal<boolean>(false);
  estudioVistoId = signal<number>(null);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<BuscarEstudioModalComponent>,
    private studiesService: StudiesService,
    private ventaConceptosService: VentaConceptosService,
    private alertaService: AlertaService
  ) {
    this.estudio = this.data.estudio as VentaConceptos;
  }

  ngOnInit(): void {
    console.log('entro aqui');
    const apellidoPaterno = this.estudio.paciente.apellidoPaterno;
    const apellidoMaterno = this.estudio.paciente.apellidoMaterno;
    this.nombreBuscar = `${apellidoPaterno} ${apellidoMaterno}`;
    this.buscarEstudiosPorNombre();
  }

  cancelar() {
    this.modalRef.close();
  }

  ver(estudio: Study): void {
    this.estudioVisto.set(true);
    this.estudioVistoId.set(estudio.id);
    window.open(`${VIEWER}${estudio.studyIuid}`);
  }

  vincular(estudio: Study): void {
    const estudioVisto = this.estudioVisto();
    if (!estudioVisto) {
      Swal.fire({
        title: 'Estudio no visto',
        text: 'Primero visualice el estudio, después vincúlelo',
        icon: 'error',
      });
      return;
    }
    if (this.estudioVistoId() !== estudio.id) {
      Swal.fire({
        title: 'Estudio no visualizado',
        text: 'Este no es el estudio que usted abrió, visualícelo primero',
        icon: 'error',
      });
      return;
    }

    this.estudio.iuid = estudio.studyIuid;
    this.estudio.estado = 'TOMADO';
    this.actualizarEstudio(); // Si actualizarEstudio es asíncrona, asegurarse de await
    this.alertaService.exito('Vinculado', 'Se ha vinculado el estudio');
    this.modalRef.close();
    return;
  }

  actualizarEstudio(): void {
    this.ventaConceptosService.editar(this.estudio).subscribe((venta) => {
      this.estudio = venta;
    });
  }

  buscarEstudiosPorNombre() {
    console.log(this.nombreBuscar);
    this.studiesService
      .buscarLikeNombre(
        this.nombreBuscar,
        this.paginaActual.toString(),
        this.totalPorPagina.toString()
      )
      .subscribe(
        (estudios) => {
          this.estudios = estudios.content;
          this.totalRegistros = estudios.totalElements as number;
          this.paginator._intl.itemsPerPageLabel = 'Registros:';
          console.log(estudios);
        },
        (error) => {
          if ((error.status = 400)) {
            console.log('No puedo buscar nada');
            this.estudios = [];
          }
        }
      );
  }

  public paginar(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.totalPorPagina = event.pageSize;
    this.buscarEstudiosPorNombre();
  }
}
