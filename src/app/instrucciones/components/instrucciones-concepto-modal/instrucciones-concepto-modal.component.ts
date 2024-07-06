import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Concepto } from 'src/app/models/concepto';
import { ConceptosService } from 'src/app/services/conceptos.service';

@Component({
  selector: 'app-instrucciones-concepto-modal',
  templateUrl: './instrucciones-concepto-modal.component.html',
  styleUrls: ['./instrucciones-concepto-modal.component.css']
})
export class InstruccionesConceptoModalComponent implements OnInit {

  concepto: Concepto;

  constructor( 
    private conceptoService: ConceptosService,
    public dialogRef: MatDialogRef<InstruccionesConceptoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) 
    { }

  ngOnInit(): void {
    if(this.data.conceptoId){
      const id = this.data.conceptoId;
      console.log(id);
      this.conceptoService.ver(id).subscribe(concepto => {
        this.concepto = concepto;
      });
    }
  }

}
