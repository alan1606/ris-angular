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

  @Input() areaRecibida: Area;
  @Input() citas: Cita[] = [];
  @Output() citasFiltradasEmit = new EventEmitter<Cita[]>();

  area: Area = new Area();
  busqueda: string = '';
  citasFiltradas: Cita[] = [];
  equipoDicom: EquipoDicom;
  equiposDicom: EquipoDicom[] = [];

  ngOnInit(): void {
    setInterval(() => {
      if (this.areaRecibida) {
        this.area = this.areaRecibida;
        this.cargarEquiposDicom();
        console.log(this.equiposDicom);
      }
    }, 1000);
  }

  private cargarEquiposDicom(): void {
    this.equipoDicomService
      .filtrarPorArea(this.area.id)
      .subscribe((equipos) => {
        this.equiposDicom = equipos;
      });
  }

  filtrarCitasPorSalaId(): void {
    this.citasFiltradas = !this.equipoDicom
      ? this.citas
      : this.citas.filter(
          (cita) => cita.horario.salaId === this.equipoDicom.id
        );
    console.log(this.citasFiltradas);
    this.citasFiltradasEmit.emit(this.citasFiltradas);
    return;
  }
}
