import { Injectable } from '@angular/core';
import Swal, { SweetAlertArrayOptions, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  constructor() {}

  exito(title: string = '', text: string = ''): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
    });
  }

  campoInvalido(titulo: string, texto: string = ''): void {
    Swal.fire({
      icon: 'info',
      title: titulo,
      text: texto,
    });
  }
  error(error): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
    });
    console.log(error);
  }

  info(
    titulo: string = '',
    texto: string = '',
    outsideClick: boolean = true,
    confirmButton:boolean=true
  ): Promise<SweetAlertResult<Awaited<any>>> {
    return Swal.fire({
      icon: 'info',
      title: titulo,
      text: texto,
      allowOutsideClick: outsideClick,
      showConfirmButton:confirmButton
    });
  }

  close():void{
    Swal.close()
  }
}
