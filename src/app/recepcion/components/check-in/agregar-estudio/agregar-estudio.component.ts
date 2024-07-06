import { Component, Inject } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AreasService } from 'src/app/services/areas.service';
import { ConceptosService } from 'src/app/services/conceptos.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';

@Component({
  selector: 'app-agregar-estudio',
  templateUrl: './agregar-estudio.component.html',
  styleUrls: ['./agregar-estudio.component.css']
})
export class AgregarEstudioComponent {

  area:Area;
  concepto: Concepto;
  equipoDicom: EquipoDicom;
  equiposDicom: EquipoDicom[] = [];

  autocompleteControlArea = new UntypedFormControl();
  autocompleteControlConcepto = new UntypedFormControl();
  areasFiltradas: Area[] = [];
  conceptosFiltrados: Concepto[] = [];

  constructor(
    public dialogRef: MatDialogRef<AgregarEstudioComponent>,
    private conceptoService: ConceptosService,
    private areaService: AreasService,
    private equipoDicomService: EquipoDicomService
  ){
    this.autocompleteControlConcepto.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.concepto),
      mergeMap(valor => valor && this.area?.id ?  this.conceptoService.buscarLikeNombreEnArea(valor, this.area.id) : [])
    ).subscribe(conceptos => {
      this.conceptosFiltrados = conceptos;
    });

    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areaService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => {
      this.areasFiltradas = areas;
      this.autocompleteControlConcepto.setValue("");
      this.conceptosFiltrados = [];
      this.concepto = null;
    });
  }


  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  mostrarNombreConcepto(concepto ?: Concepto): string {
    return concepto ? concepto.concepto : '';
  }


  seleccionarArea(event: MatAutocompleteSelectedEvent){
    this.area = event.option.value as Area;

    event.option.deselect();
    event.option.focus();

    this.cargarEquiposDicom();
  }


  seleccionarConcepto(event: MatAutocompleteSelectedEvent): void {
    this.concepto = event.option.value as Concepto;

   this.conceptoService.ver(this.concepto.id).subscribe( concepto => {
    let venta = new VentaConceptos();
    venta.concepto = concepto;
    venta.equipoDicom = this.equipoDicom;
    venta.fechaAsignado = '';
    venta.horaAsignado = '';
    this.dialogRef.close(venta);
   }
   );

    event.option.deselect();
    event.option.focus();
  }

  seleccionarEquipoDicom(event): void {
    this.equipoDicom = event.value as EquipoDicom;

    event.option.deselect();
    event.option.focus();
  }

  private cargarEquiposDicom(): void{
    this.equipoDicomService.filtrarPorArea(this.area.id).subscribe(
      equipos =>{
        this.equiposDicom = equipos;
      }
    );
  }
}
