import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgregarformasPagoModalComponent } from '../agregarformas-pago-modal/agregarformas-pago-modal.component';

@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.css'],
})
export class FormasPagoComponent {
  constructor(private dialog: MatDialog) {}

  displayedColumns: string[] = ['Forma', 'editar'];
  dataSource = [
    { id: 1, Forma: 'Tarjeta de credito' },
    { id: 2, Forma: 'Cuerpo' },
  ];

  nuevaForma(): void {
    const modalRef = this.dialog.open(AgregarformasPagoModalComponent, {
      width: '350',
    });
  }

  editarForma(id: number): void {
    console.log(id);
    const modalRef = this.dialog.open(AgregarformasPagoModalComponent, {
      width: '350',
      data: { idForma: id },
    });
  }
}
