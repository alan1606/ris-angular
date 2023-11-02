import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-instrucciones-area-modal',
  templateUrl: './instrucciones-area-modal.component.html',
  styleUrls: ['./instrucciones-area-modal.component.css']
})
export class InstruccionesAreaModalComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<InstruccionesAreaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data.areaId);
    
  }

}
