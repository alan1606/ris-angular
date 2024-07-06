import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Movimiento, TipoMovimiento } from 'src/app/models/movimiento';
import Swal from 'sweetalert2';
import { MovimientosCortesService } from '../../services/movimientos-cortes.service';
import { CorteService } from '../../services/corte.service';

@Component({
  selector: 'app-agregar-movimiento-corte-modal',
  templateUrl: './agregar-movimiento-corte-modal.component.html',
  styleUrls: ['./agregar-movimiento-corte-modal.component.css'],
})
export class AgregarMovimientoCorteModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<AgregarMovimientoCorteModalComponent>,
    private movimientoCortesService: MovimientosCortesService,
    private corteService: CorteService
  ) {}

  tipos = [TipoMovimiento.ENTRADA, TipoMovimiento.SALIDA];
  model: Movimiento = new Movimiento();

  ngOnInit(): void {
    this.corteService.obtenerCorteActual().subscribe(
      (data) => {
        this.model.corteTurnoId = data.id;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  confirmarAgregar(): void {
    let fecha = new Date().toISOString().slice(0, 10);

    Swal.fire({
      icon: 'question',
      title: '¿Seguro que deseas añadirlo?',
      text: 'Una vez agregado no existiran modificaciones.',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.movimientoCortesService
          .agregarMovimientoCorte(fecha, this.model)
          .subscribe(
            (data) => {
              Swal.fire({
                icon: 'success',
                title: 'Agregado',
                showConfirmButton: false,
                timer: 1500,
                allowOutsideClick: false,
              });
              this.dialogRef.close(data);
            },
            (error) => {
              console.log(error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                showConfirmButton: false,
              });
              this.dialogRef.close();
            }
          );
      } else {
        console.log('no guardar');
      }
    });
  }
}
