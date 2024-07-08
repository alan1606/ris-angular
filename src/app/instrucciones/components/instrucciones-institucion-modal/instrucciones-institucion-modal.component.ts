import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Institucion } from 'src/app/models/institucion';
import { InstitucionService } from 'src/app/services/institucion.service';

@Component({
  selector: 'app-instrucciones-institucion-modal',
  templateUrl: './instrucciones-institucion-modal.component.html',
  styleUrls: ['./instrucciones-institucion-modal.component.css']
})
export class InstruccionesInstitucionModalComponent implements OnInit {

  institucion: Institucion;

  constructor( 
    private institucionService: InstitucionService,
    public dialogRef: MatDialogRef<InstruccionesInstitucionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) 
    { }

  ngOnInit(): void {
    if(this.data.institucionId){
      const id = this.data.institucionId;
      console.log(id);
      this.institucionService.ver(id).subscribe(institucion => this.institucion = institucion);
    }
  }

}
