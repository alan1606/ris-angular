import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormaPago } from 'src/app/models/formaPago';
import { FormaPagoService } from '../../services/forma-pago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregarformas-pago-modal',
  templateUrl: './agregarformas-pago-modal.component.html',
  styleUrls: ['./agregarformas-pago-modal.component.css'],
})
export class AgregarformasPagoModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    private formaPagoService: FormaPagoService
  ) {}

  idFormaPago: number = null;

  formaPago: FormaPago = new FormaPago();

  ngOnInit(): void {
    if (this.id) {
      this.idFormaPago = this.id;
      this.formaPagoService.buscarFormaPagoPorId(this.id).subscribe(
        (data) => {
          this.formaPago = data;
        },
        (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
          });
        }
      );
    }
  }

  agregarFormaPago(): void {
    this.formaPagoService.agregarFormaPago(this.formaPago).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Listo',
          text: 'Forma de pago agregada.',
        });
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
        });
      }
    );
  }

  editarFormaPago(): void {
    this.formaPagoService.editarFormaPago(this.id, this.formaPago).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Listo',
          text: 'Forma de pago editada.',
        });
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
        });
      }
    );
  }
}
