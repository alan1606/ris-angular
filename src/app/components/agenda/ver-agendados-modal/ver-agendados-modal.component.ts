import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Area } from 'src/app/models/area';
import { EstudioHora } from 'src/app/models/estudio-hora';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';

@Component({
  selector: 'app-ver-agendados-modal',
  templateUrl: './ver-agendados-modal.component.html',
  styleUrls: ['./ver-agendados-modal.component.css']
})
export class VerAgendadosModalComponent implements OnInit {

  titulo : string;
  private area: Area;
  private fecha: string;
  estudiosHoras: EstudioHora[] = [];
  mostrarColumnasAgenda = ['hora', 'estudio', 'paciente', 'institucion'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private pipe: DatePipe,
  public modalRef: MatDialogRef<VerAgendadosModalComponent>,
  private ventaConceptosService: VentaConceptosService) { 
    this.area = this.data.area as Area;
    this.fecha = this.data.fecha as string;
  }

  ngOnInit(): void {
    this.titulo = `Agenda de ${this.area.nombre} del ${this.pipe.transform(new Date(this.fecha.replace(/-/g, '\/')), 'dd-MM-yyyy')}`;
    this.cargarEstudiosHoras();
  }

  private cargarEstudiosHoras() {
    this.ventaConceptosService.encontrarEstudiosAgendadosPorAreaFecha(this.area.id, this.fecha).subscribe(
      estudiosHoras => this.estudiosHoras = estudiosHoras
    );
  }

  cancelar(){
    this.modalRef.close();
  }

}
