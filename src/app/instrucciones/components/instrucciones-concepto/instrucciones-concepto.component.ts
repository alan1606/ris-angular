import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Concepto } from 'src/app/models/concepto';
import { ConceptosService } from 'src/app/services/conceptos.service';

@Component({
  selector: 'app-instrucciones-concepto',
  templateUrl: './instrucciones-concepto.component.html',
  styleUrls: ['./instrucciones-concepto.component.css']
})
export class InstruccionesConceptoComponent implements OnInit {

  conceptos: Concepto[] = [];
  concepto: Concepto;


  constructor(
    private conceptoService: ConceptosService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }


  openDialog(areaId: number): void {
   //
  }

}
