import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Campania } from '../../models/campania';
import { CampaniaService } from '../../services/campania.service';

@Component({
  selector: 'app-detalles-campania-modal',
  templateUrl: './detalles-campania-modal.component.html',
  styleUrls: ['./detalles-campania-modal.component.css']
})
export class DetallesCampaniaModalComponent implements OnInit {

  campania: Campania = new Campania;

  constructor(
    public dialogRef: MatDialogRef<DetallesCampaniaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private campaniaService: CampaniaService
  ) {
  
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    this.campaniaService.ver(this.data.idCampania).subscribe(
      campania => {
        this.campania = campania;
        console.log(campania);
      },
      () => this.dialogRef.close()
    );

  }

}
