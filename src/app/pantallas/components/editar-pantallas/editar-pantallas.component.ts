import { Component, inject } from '@angular/core';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { DataService } from 'src/app/shared/services/data.service';
import { DicomRoom } from '../../models/DicomRoom';
import { PantallasService } from '../../services/pantallas.service';

@Component({
  selector: 'app-editar-pantallas',
  templateUrl: './editar-pantallas.component.html',
  styleUrl: './editar-pantallas.component.css',
})
export class EditarPantallasComponent {
  private dataService = inject(DataService);
  private pantallasService = inject(PantallasService);
  public area: Area = null;
  public salas: EquipoDicom = null;
  public displayName: string = '';

  constructor() {}

  public agregarSala(): void {
    let nuevaSala: DicomRoom = new DicomRoom(this.salas.id, this.displayName);
    this.pantallasService.addRoomToScreens(nuevaSala).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => console.log(error)
    );
  }

  public recibirArea(event: any) {
    console.log(event);
    this.area = event;
    this.dataService.updateAreaData(this.area);
  }
  public recibirSala(event) {
    this.salas = event;
  }
}
