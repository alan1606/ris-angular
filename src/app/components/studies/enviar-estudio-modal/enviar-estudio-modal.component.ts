import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentaConceptos } from 'src/app/models/venta-conceptos';

@Component({
  selector: 'app-enviar-estudio-modal',
  templateUrl: './enviar-estudio-modal.component.html',
  styleUrls: ['./enviar-estudio-modal.component.css']
})
export class EnviarEstudioModalComponent implements OnInit {

  estudio: VentaConceptos;
  enviado: VentaConceptos;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public modalRef: MatDialogRef<EnviarEstudioModalComponent>) {   }

  ngOnInit(): void {
    this.estudio = this.data.estudio as VentaConceptos;
  }


  enviar(estudio: VentaConceptos): void{

  }
}
