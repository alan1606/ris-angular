import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistrarPacienteComponent } from '../../registrar-paciente-modal/registrar-paciente.component';
import { RegistrarPacienteParcialModalComponent } from '../../registrar-paciente-parcial-modal/registrar-paciente-parcial-modal.component';
import { Paciente } from 'src/app/models/paciente';
import { PacientesService } from 'src/app/services/pacientes.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { error } from 'console';
import { VerOrdenModalComponent } from '../ver-orden-modal/ver-orden-modal.component';
@Component({
  selector: 'app-paciente-ordenes',
  templateUrl: './paciente-ordenes.component.html',
  styleUrls: ['./paciente-ordenes.component.css'],
})
export class PacienteOrdenesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modalRef: MatDialogRef<PacienteOrdenesComponent>,
    private pacientesService:PacientesService,
    private dialog:MatDialog
  ) {}

  model: Paciente = null;
  ordenes:any=[{"id":300, "concepto":"torax","precio":100},{"id":2, "concepto":"craneo","precio":100},{"id":3,"concepto":"pierna", "precio":100}];

  ngOnInit(): void {
    if (this.data?.paciente?.id) {
      this.model = this.data?.paciente as Paciente;
      // this.buscarOrdenesVentaPacienteHoy(1)
    }

    console.log(this.model);
  }
  buscarOrdenesVentaPacienteHoy(idOrdenVenta:number):void{
    this.pacientesService.buscarPacienteConOrdenVentaHoy(idOrdenVenta).subscribe(data=>this.ordenes, error => error);
  }

  seleccionarOrden():void{

  }
  abrirVerOrdenModal(id:number): void {
    const ordenEncontrada=this.ordenes.find(orden => orden.id === id);
    console.log(ordenEncontrada)
    const modalRef = this.dialog.open(VerOrdenModalComponent,
      {
        width: "1000px",
        data: {ordenEncontrada}
      });
      
      modalRef.afterClosed().subscribe(paciente => {
        if(paciente){
          
        }
      });
  }
}
