import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { ConceptosService } from 'src/app/services/conceptos.service';

@Component({
  selector: 'app-cambiar-estudio',
  templateUrl: './cambiar-estudio.component.html',
  styleUrls: ['./cambiar-estudio.component.css']
})
export class CambiarEstudioComponent  {

  autocompleteControlConcepto = new UntypedFormControl();
  conceptosFiltrados: Concepto[] = [];
  private area: Area;
  concepto: Concepto;

  constructor( public dialogRef: MatDialogRef<CambiarEstudioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private conceptoService: ConceptosService){
      this.area = data.estudio.concepto.area;
      console.log(this.area);

      this.autocompleteControlConcepto.valueChanges.pipe(
        map(valor => typeof valor === 'string' ? valor : valor.concepto),
        mergeMap(valor => valor && this.area?.id ? this.conceptoService.buscarLikeNombreEnArea(valor, this.area.id) : [])
      ).subscribe(conceptos => {
        this.conceptosFiltrados = conceptos;
      });
    } 


  seleccionarConcepto(event: MatAutocompleteSelectedEvent): void {
    this.concepto = event.option.value as Concepto;

    this.conceptoService.ver(this.concepto.id).subscribe(concepto => {
      this.concepto = concepto;
    });
    event.option.deselect();
    event.option.focus();
  }

  mostrarNombreConcepto(concepto?: Concepto): string {
    return concepto ? concepto.concepto : '';
  }

  guardar(){
    this.dialogRef.close(this.concepto);
  }
}
