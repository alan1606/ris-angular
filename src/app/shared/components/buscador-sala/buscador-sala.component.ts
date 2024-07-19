import { Component, inject, OnInit, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';

@Component({
  selector: 'app-buscador-sala',
  templateUrl: './buscador-sala.component.html',
  styleUrls: ['./buscador-sala.component.css'],
})
export class BuscadorSalaComponent implements OnInit {
  salaEmit = output<EquipoDicom>();
  private dataService=inject(DataService);
  subscription: Subscription;
  area: Area = new Area();
  busqueda: string = '';
  equipoDicom: EquipoDicom;
  equiposDicom: EquipoDicom[] = [];
  equipoDicomService = inject(EquipoDicomService);

  ngOnInit(): void {
    this.subscription = this.dataService.areaData$.subscribe((data) => {
      if (data) {
        this.area = data;
        this.cargarEquiposDicom();
      }
    });
  }

  private cargarEquiposDicom(): void {
    if (!this.area.id) {
      return;
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

  salaSeleccionada(): void {
    this.salaEmit.emit(this.equipoDicom);
  }

}
