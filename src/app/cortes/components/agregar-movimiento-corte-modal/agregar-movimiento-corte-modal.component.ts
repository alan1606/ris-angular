import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-movimiento-corte-modal',
  templateUrl: './agregar-movimiento-corte-modal.component.html',
  styleUrls: ['./agregar-movimiento-corte-modal.component.css'],
})
export class AgregarMovimientoCorteModalComponent {
  constructor(
    private dialogRef: MatDialogRef<AgregarMovimientoCorteModalComponent>
  ) {}

  confirmarAgregar(): void {
    Swal.fire({
      icon: 'question',
      title: '¿Seguro que deseas añadirlo?',
      text: 'Una vez agregado no existiran modificaciones.',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      } else {
        console.log('no guardar');
      }
    });
  }
}
