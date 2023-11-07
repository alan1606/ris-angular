import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { AreasService } from 'src/app/services/areas.service';
import { ConceptosService } from 'src/app/services/conceptos.service';
import { InstruccionesConceptoModalComponent } from '../instrucciones-concepto-modal/instrucciones-concepto-modal.component';

@Component({
  selector: 'app-instrucciones-concepto',
  templateUrl: './instrucciones-concepto.component.html',
  styleUrls: ['./instrucciones-concepto.component.css']
})
export class InstruccionesConceptoComponent implements OnInit {

  areas: Area[] = [];
  area: Area;

  conceptos: Concepto[] = [];
  concepto: Concepto;


  constructor(
    private conceptoService: ConceptosService,
    private areaService: AreasService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.areaService.listar().subscribe(areas => this.areas = areas);
  }

  seleccionarArea(areaId: number){
    this.area = new Area();
    this.area.id = areaId;
    this.conceptoService.buscarPorArea(this.area).subscribe(conceptos => this.conceptos = conceptos);
  }


  openDialog(conceptoId: number): void {
    this.conceptoService.ver(conceptoId).subscribe(concepto => this.concepto= concepto);

    const dialogRef = this.dialog.open(InstruccionesConceptoModalComponent, {
      data: { conceptoId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.concepto.instrucciones = result;
        this.conceptoService.editar(this.concepto).subscribe(concepto => {
          this.concepto = concepto;
        },
          err => {
            console.log(err);
          }
        );
      }
    });
  }

}
