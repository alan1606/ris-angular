import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { Institucion, InstitucionService } from '../agendar';

@Component({
  selector: 'app-mostrar-citas-por-dia-pensiones',
  templateUrl: './mostrar-citas-por-dia-pensiones.component.html',
  styleUrls: ['./mostrar-citas-por-dia-pensiones.component.css']
})
export class MostrarCitasPorDiaPensionesComponent implements OnInit {

  fecha: string = "";
  estudios: VentaConceptos[] = [];
  institucion: Institucion;

  constructor(
    public dialogRef: MatDialogRef<MostrarCitasPorDiaPensionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ventaConceptosService: VentaConceptosService,
    private institucionService: InstitucionService
  ) {    }

  ngOnInit(): void {
    this.fecha = this.data.dia;
    const salaId: number = this.data.salaId;
    const institucionId: number = this.data.institucionId;
    this.institucionService.ver(institucionId).subscribe(institucion =>{
      this.institucion = institucion;
    },
  error =>{
    console.error(error);
  });

    this.ventaConceptosService.encontrarUltrasonidosEnFecha(this.fecha, salaId, institucionId).subscribe(estudios =>{
      this.estudios = estudios;
      console.log(estudios);
    },
    error =>{
      console.log(error);
    }
    );
  }

}
