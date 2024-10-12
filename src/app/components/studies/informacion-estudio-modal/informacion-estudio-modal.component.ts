import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AntecedenteEstudioService } from 'src/app/services/antecedente-estudio.service';


@Component({
  selector: 'app-informacion-estudio-modal',
  templateUrl: './informacion-estudio-modal.component.html',
  styleUrls: ['./informacion-estudio-modal.component.css']
})
export class InformacionEstudioModalComponent implements OnInit {
  estudio: VentaConceptos;
  titulo: string; 
  antecedentesJuntos: string = "";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public modalRef: MatDialogRef<InformacionEstudioModalComponent>,
  private antecedenteEstudioService: AntecedenteEstudioService) { }

  ngOnInit(): void {
    this.estudio = this.data.estudio as VentaConceptos;
    this.titulo = `${this.estudio.institucion.nombre}: ${this.estudio.concepto.concepto} de ${this.estudio.paciente.nombreCompleto}`;

    this.antecedenteEstudioService.filtrarPorVentaConceptosId(this.estudio.id).subscribe(a => a.forEach(antecedente => {
      this.antecedentesJuntos += `${antecedente.antecedente.nombre}, `;
      console.log(antecedente.antecedente.nombre);
    }));
  }

  cancelar() {
    this.modalRef.close();
  }
}
