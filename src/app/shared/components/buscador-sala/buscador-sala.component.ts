import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Area } from 'src/app/models/area';
import { Cita } from 'src/app/models/cita';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';

@Component({
  selector: 'app-buscador-sala',
  templateUrl: './buscador-sala.component.html',
  styleUrls: ['./buscador-sala.component.css'],
})
export class BuscadorSalaComponent implements OnInit {
  constructor(private equipoDicomService: EquipoDicomService) {}

  @Input() area: Area;
  @Input() citas: Cita[] = [];
  @Output() citasFiltradasEmit = new EventEmitter<Cita[]>();

  busqueda: string = '';
  citasFiltradas: Cita[] = [];
  total: number = 0;
  equipoDicom: EquipoDicom;
  equiposDicom: EquipoDicom[] = [];
  ngOnInit(): void {
    setInterval(() => {}, 500);
  }
  private cargarEquiposDicom(): void {
    this.equipoDicomService
      .filtrarPorArea(this.area.id)
      .subscribe((equipos) => {
        this.equiposDicom = equipos;
      });
  }
}
