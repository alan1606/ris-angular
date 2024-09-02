import { Injectable } from '@angular/core';
import Swal, { SweetAlertArrayOptions, SweetAlertResult } from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  constructor() {}

  public exito(title: string = '', text: string = ''): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
    });
  }

  public campoInvalido(titulo: string, texto: string = ''): void {
    Swal.fire({
      icon: 'info',
      title: titulo,
      text: texto,
    });
  }
  public error(error): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
    });
    console.log(error);
  }

  public info(
    titulo: string = '',
    texto: string = '',
    outsideClick: boolean = true,
    confirmButton: boolean = true
  ): Promise<SweetAlertResult<Awaited<any>>> {
    return Swal.fire({
      icon: 'info',
      title: titulo,
      text: texto,
      allowOutsideClick: outsideClick,
      showConfirmButton: confirmButton,
    });
  }

  public pacientArrived(
    nombre: string = '',
    sala: string = '',
    study: string = ''
  ): void {
    Swal.fire({
      icon: 'info',
      title: `${nombre} en sala de espera`,
      footer: `${study}`,
      html: `
      <p>${sala}</p>
      <audio autoplay style="display:none;">
      <source src="../../../assets/messanger.mp3" type="audio/mpeg">
      </audio>`,
      toast: true,
      position: 'bottom-right',
      showConfirmButton: false,
    });
  }

  public patientTaken(): void {}

  public close(): void {
    Swal.close();
  }
}
