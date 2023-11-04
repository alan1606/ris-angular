import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Area } from 'src/app/models/area';
import { AreasService } from 'src/app/services/areas.service';
import { InstruccionesAreaModalComponent } from '../instrucciones-area-modal/instrucciones-area-modal.component';

@Component({
  selector: 'app-instrucciones-area',
  templateUrl: './instrucciones-area.component.html',
  styleUrls: ['./instrucciones-area.component.css']
})
export class InstruccionesAreaComponent implements OnInit {

  areas: Area[] = [];
  area: Area;


  constructor(
    private areaService: AreasService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.areaService.listar().subscribe(areas => this.areas = areas);
  }


  openDialog(areaId: number): void {
    this.areaService.ver(areaId).subscribe(area => this.area= area);

    const dialogRef = this.dialog.open(InstruccionesAreaModalComponent, {
      data: { areaId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.area.instrucciones = result;
        this.areaService.editar(this.area).subscribe(area => {
          this.area = area;
        },
          err => {
            console.log(err);
          }
        );
      }
    });
  }
}
