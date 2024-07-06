import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AgregarformasPagoModalComponent } from '../agregarformas-pago-modal/agregarformas-pago-modal.component';
import { FormaPagoService } from '../../services/forma-pago.service';
import { FormaPago } from 'src/app/models/formaPago';

@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.css'],
})
export class FormasPagoComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private formasPagoService: FormaPagoService
  ) {}

  displayedColumns: string[] = ['Forma', 'editar'];
  dataSource: FormaPago[] = [];

  ngOnInit(): void {
    this.formasPagoService.buscarFormasPago().subscribe((data) => {
      this.dataSource = data;
    });
  }

  nuevaForma(): void {
    const modalRef = this.dialog.open(AgregarformasPagoModalComponent, {
      width: '350',
    });
    modalRef.afterClosed().subscribe(() => {
      this.formasPagoService.buscarFormasPago().subscribe((data) => {
        console.log(data);
        this.dataSource = data;
      });
    });
  }

  editarForma(id: number): void {
    console.log(id);
    const modalRef = this.dialog.open(AgregarformasPagoModalComponent, {
      width: '350',
      data: id,
    });
    modalRef.afterClosed().subscribe(() => {
      this.formasPagoService.buscarFormasPago().subscribe((data) => {
        console.log(data);
        this.dataSource = data;
      });
    });
  }
}
