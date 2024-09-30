import { Component, Inject, inject, OnInit } from '@angular/core';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { DataService } from 'src/app/shared/services/data.service';
import { DicomRoom } from '../../models/DicomRoom';
import { PantallasService } from '../../services/pantallas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-pantallas',
  templateUrl: './editar-pantallas.component.html',
  styleUrl: './editar-pantallas.component.css',
})
export class EditarPantallasComponent implements OnInit {
  private dataService = inject(DataService);
  private pantallasService = inject(PantallasService);
  public area: Area = null;
  public salas: EquipoDicom = null;
  public displayName: string = '';

  constructor(
    private dialogRef: MatDialogRef<EditarPantallasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DicomRoom = null
  ) {}

  ngOnInit(): void {
    if (this.data) {
      console.log(this.data);
      this.displayName = this.data.displayName;
    }
  }

  public agregarSala(): void {
    let nuevaSala: DicomRoom = new DicomRoom(this.salas.id, this.displayName);
    this.pantallasService.addRoomToScreens(nuevaSala).subscribe(
      (data) => {
        console.log(data);
        this.dialogRef.close();
      },
      (error) => console.log(error)
    );
  }

  guardarCambios(): void {
    let nuevaSala: DicomRoom = new DicomRoom(
      this.data.id,
      this.displayName,
      this.data.enabled
    );
    console.log(nuevaSala);
    this.pantallasService.addRoomToScreens(nuevaSala).subscribe(
      (data) => {
        console.log(data);
        this.dialogRef.close(nuevaSala);
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
