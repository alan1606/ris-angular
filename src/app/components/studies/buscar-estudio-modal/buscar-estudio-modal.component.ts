import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VIEWER } from 'src/app/config/app';
import { Study } from 'src/app/models/study';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { StudiesService } from 'src/app/services/studies.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-estudio-modal',
  templateUrl: './buscar-estudio-modal.component.html',
  styleUrls: ['./buscar-estudio-modal.component.css']
})
export class BuscarEstudioModalComponent implements OnInit {

  estudio: VentaConceptos;
  estudios: Study[] = [];
  nombreBuscar: string;
  mostrarColumnasEstudios = ['id', 'fecha', 'paciente', 'estudio', 'idPacs', 'ver', 'vincular'];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<BuscarEstudioModalComponent>,
    private studiesService: StudiesService,
    private ventaConceptosService: VentaConceptosService) {
    this.estudio = this.data.estudio as VentaConceptos;
  }

  ngOnInit(): void {
    const apellidoPaterno = this.estudio.paciente.apellidoPaterno;
    const apellidoMaterno = this.estudio.paciente.apellidoMaterno;
    this.nombreBuscar = `${apellidoPaterno} ${apellidoMaterno}`;
    this.buscarEstudiosPorNombre();
  }

  cancelar() {
    this.modalRef.close();
  }

  ver(estudio: Study): void {
    window.open(`${VIEWER}${estudio.studyIuid}`);
  }

  vincular(estudio: Study): void {
    this.estudio.iuid = estudio.studyIuid;
    this.estudio.estado = "TOMADO";
    this.actualizarEstudio();
    Swal.fire('Vinculado', 'Se ha vinculado el estudio', 'success');
    this.modalRef.close();
  }

  actualizarEstudio(): void {
    this.ventaConceptosService.editar(this.estudio).subscribe(venta => {
      this.estudio = venta;
    });
  }

  buscarEstudiosPorNombre() {
    console.log(this.nombreBuscar);
    this.studiesService.buscarLikeNombre(this.nombreBuscar)
      .subscribe(estudios => { this.estudios = estudios; console.log(estudios) },
      error =>{
        if(error.status = 400){
          console.log("No puedo buscar nada");
          this.estudios = [];
        }
      }
      );
  }

}
