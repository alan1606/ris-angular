import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Paciente } from 'src/app/models/paciente';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { VerOrdenModalComponent } from '../ver-orden-modal/ver-orden-modal.component';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';

@Component({
  selector: 'app-paciente-ordenes',
  templateUrl: './paciente-ordenes.component.html',
  styleUrls: ['./paciente-ordenes.component.css'],
})
export class PacienteOrdenesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<PacienteOrdenesComponent>,
    private ordenVentaService: OrdenVentaService,
    private dialog: MatDialog
  ) { }

  model: Paciente = null;
  ordenSeleccionadaHoy: OrdenVenta = null;
  ordenesHoy: OrdenVenta[] = null;

  ngOnInit(): void {
    if (this.data?.paciente?.id) {
      this.model = this.data?.paciente as Paciente;
      this.buscarOrdenesVentaPacienteHoy(this.model.id)
    }
  }

  buscarOrdenesVentaPacienteHoy(idOrdenVenta: number): void {
    this.ordenVentaService.buscarOrdenVentaPorPacienteIdHoy(idOrdenVenta).subscribe(
      ordenesData => {
        this.ordenesHoy = ordenesData as OrdenVenta[]
        console.log(this.ordenesHoy)
        if(this.ordenesHoy.length == 1){
          this.seleccionar(this.ordenesHoy[0]);
        }
      }, error => error);
  }

  cerrarModal(): void {
    this.modalRef.close();
  }

  seleccionar(orden: OrdenVenta){
    this.modalRef.close(orden);
  }
}
