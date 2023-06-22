import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    campaniaService.ver(data.idCampania).subscribe(
      campania => {
        this.campania = campania;
        console.log(campania);
      },
      () => dialogRef.close()
    );
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
