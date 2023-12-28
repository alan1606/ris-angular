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
    private ordenVentaService:OrdenVentaService,
    private dialog:MatDialog
  ) {}

  model: Paciente = null;
  ordenSeleccionadaHoy:OrdenVenta=null;
  ordenes:OrdenVenta[];
  ordenesHoy:OrdenVenta[]=null;
  
  ngOnInit(): void {
    if (this.data?.paciente?.id) {
      this.model = this.data?.paciente as Paciente;
      this.buscarOrdenesVentaPacienteHoy(this.model.id)
    }
  }
  buscarOrdenesVentaPacienteHoy(idOrdenVenta:number):void{
    this.ordenVentaService.buscarOrdenVentaPorPacienteIdHoy(idOrdenVenta).subscribe(
      ordenesData=>{
        this.ordenesHoy= ordenesData as OrdenVenta[]
        console.log(this.ordenesHoy)
      }, error => error);
  }
  esFechaDeHoy(fechaVenta: string): boolean {
    const fechaOrden = fechaVenta;
    const fechaHoy = "2023-12-16T09:19:37";
    return (
       fechaOrden === fechaHoy 
    );
  }
  
  abrirVerOrdenModal(orden:OrdenVenta): void {
    this.ordenSeleccionadaHoy=orden;
    const modalRef = this.dialog.open(VerOrdenModalComponent,
      {
        width: "2000px",
        data: {orden:this.ordenSeleccionadaHoy? this.ordenSeleccionadaHoy : null}
      });
      modalRef.afterClosed().subscribe(paciente => {
        if(paciente){
          
        }
      });
  }

  cerrarModal():void{
    this.dialog.closeAll();
  }
}
