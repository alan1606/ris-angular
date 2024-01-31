import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';

@Component({
  selector: 'app-mostrar-citas-por-dia-pensiones',
  templateUrl: './mostrar-citas-por-dia-pensiones.component.html',
  styleUrls: ['./mostrar-citas-por-dia-pensiones.component.css']
})
export class MostrarCitasPorDiaPensionesComponent implements OnInit {

  fecha: string = "";
  estudios: VentaConceptos[] = [];

  constructor(
    public dialogRef: MatDialogRef<MostrarCitasPorDiaPensionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ventaConceptosService: VentaConceptosService
  ) { }

  ngOnInit(): void {
    this.fecha = this.data.dia;
    const salaId: number = this.data.salaId;
    this.ventaConceptosService.encontrarUltrasonidosDePensionesEnFecha(this.fecha, salaId).subscribe(estudios =>{
      this.estudios = estudios;
      console.log(estudios);
    },
    error =>{
      console.log(error);
    }
    );
  }

}
