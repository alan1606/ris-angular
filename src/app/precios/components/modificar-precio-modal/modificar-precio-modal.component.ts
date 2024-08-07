import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConceptoPrecio } from '../../models/concepto-precio';
import { PreciosService } from '../../services/precios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modificar-precio-modal',
  templateUrl: './modificar-precio-modal.component.html',
  styleUrls: ['./modificar-precio-modal.component.css']
})
export class ModificarPrecioModalComponent implements OnInit {

  conceptoPrecio: ConceptoPrecio = new ConceptoPrecio;

  constructor(
    public dialogRef: MatDialogRef<ModificarPrecioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private preciosService: PreciosService
  ) {
    preciosService.ver(data.id).subscribe(
      concepto => {
        this.conceptoPrecio = concepto;
      },
      () => dialogRef.close()
    );
  }

  ngOnInit(): void {}

}
