import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Area } from 'src/app/models/area';
import { AreasService } from 'src/app/services/areas.service';

@Component({
  selector: 'app-instrucciones-area-modal',
  templateUrl: './instrucciones-area-modal.component.html',
  styleUrls: ['./instrucciones-area-modal.component.css']
})
export class InstruccionesAreaModalComponent implements OnInit {

  area: Area;

  constructor( 
    private areaService: AreasService,
    public dialogRef: MatDialogRef<InstruccionesAreaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    if(this.data.areaId){
      const id = this.data.areaId;
      console.log(id);
      this.areaService.ver(id).subscribe(area => this.area = area);
    }
  }

}
