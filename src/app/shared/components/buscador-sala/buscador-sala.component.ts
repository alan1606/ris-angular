import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/cortes/services/data.service';
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
  constructor(
    private equipoDicomService: EquipoDicomService,
    private dataService: DataService
  ) {}

  @Output() citasFiltradasEmit = new EventEmitter<Cita[]>();

  private subscription: Subscription;
  area: Area = new Area();
  busqueda: string = '';
  citasFiltradas: Cita[] = [];
  equipoDicom: EquipoDicom;
  equiposDicom: EquipoDicom[] = [];
  citas: Cita[] = [];

  ngOnInit(): void {
    this.subscription = this.dataService.areaData$.subscribe((data) => {
      if (data) {
        this.area = data;
        this.cargarEquiposDicom();
      }
    });

    this.subscription = this.dataService.citasData$.subscribe((data) => {
      this.citas = data.content;
    });
  }

  private cargarEquiposDicom(): void {
    if (!this.area.id){
      return
    }
      this.equipoDicomService.filtrarPorArea(this.area.id).subscribe(
        (equipos) => {
          this.equiposDicom = equipos;
        },
        (error) => {
          console.log('no existe el id');
        }
      );
  }

  filtrarCitasPorSalaId(): void {
    this.citasFiltradas = !this.equipoDicom
      ? this.citas
      : this.citas.filter(
          (cita) => cita.horario.salaId === this.equipoDicom.id
        );
    this.citasFiltradasEmit.emit(this.citasFiltradas);
    return;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
