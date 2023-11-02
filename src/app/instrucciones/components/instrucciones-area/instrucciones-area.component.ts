import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { map, mergeMap } from 'rxjs';
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
    const dialogRef = this.dialog.open(InstruccionesAreaModalComponent,{
      data: {areaId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
}
