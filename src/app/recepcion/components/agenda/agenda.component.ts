import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Area } from 'src/app/models/area';
import { AreaTotal } from 'src/app/models/area-total';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { VerAgendadosModalComponent } from './ver-agendados-modal/ver-agendados-modal.component';
import { FechaService } from 'src/app/services/fecha.service';


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  
  areasConTotales: AreaTotal[];
  titulo: string;
  fecha: string;

  date = new UntypedFormControl(new Date());

  constructor(private pipe: DatePipe,
    private ventaConceptosService: VentaConceptosService,
    public dialog: MatDialog,
    private fechaService: FechaService) { }

  ngOnInit(): void {
    this.fecha = this.pipe.transform(new Date(), 'yyyy-MM-dd');
    this.titulo = 'Estudios agendados';
    this.buscarTotalesPorArea();
  }

  
  public buscarTotalesPorArea(): void {

    this.ventaConceptosService.encontrarTotalesAgendadosPorAreaFecha(this.fecha).subscribe(totales => {
      this.areasConTotales = totales;
    },
      e => console.log("Error al obtener totales")
    );
  }

  public abrirAgenda(area: Area, fecha: string){
    const modalRef = this.dialog.open(VerAgendadosModalComponent,{
      width: '1000px',
      data: {"area": area,
             "fecha": fecha}
    });

    modalRef.afterClosed().subscribe(info => {
      console.log(info);
    });
  }

  public actualizarFecha(fecha: HTMLInputElement){
    this.fecha = this.fechaService.alistarFechaParaBackend(fecha.value);
    console.log(this.fecha);
    this.buscarTotalesPorArea();
  };


}
