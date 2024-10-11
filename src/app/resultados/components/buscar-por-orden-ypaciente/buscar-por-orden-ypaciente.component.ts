import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-por-orden-ypaciente',
  templateUrl: './buscar-por-orden-ypaciente.component.html',
  styleUrls: ['./buscar-por-orden-ypaciente.component.css'],
})
export class BuscarPorOrdenYPacienteComponent implements OnInit {
  @ViewChild('action', { static: true }) action?: NgxScannerQrcodeComponent;

  orden: string;
  paciente: string;

  constructor(private service: OrdenVentaService, private router: Router) {
    this.orden = '';
    this.paciente = '';
  }
  ngOnInit(): void {
    this.action?.start();

    this.action?.devices.asObservable().subscribe(
      (devices) => {
        console.log('Dispositivos de cámara detectados:', devices);

        if (devices && devices.length > 0) {
          // Buscar la cámara trasera
          const device =
            devices.find((f) =>
              /back|trás|rear|traseira|environment|ambiente/gi.test(f.label)
            ) ?? devices.pop();

          if (device) {
            console.log('Cámara seleccionada:', device.label);
            // Reproducir el dispositivo seleccionado
            this.action?.playDevice(device.deviceId);
          } else {
            console.error('No se encontró ninguna cámara trasera.');
          }
        } else {
          console.error('No se detectaron dispositivos de cámara.');
        }
      },
      (error) => console.log(error)
    );
  }

  obtener(event: any) {
    this.action.stop();
    console.log(event[0].value);
    window.open(event[0].value, 'blank');
  }

  validar(): void {
    if (!this.datosValidos()) {
      Swal.fire('Error', 'Verifique los datos', 'error');
      this.limpiar();
      return;
    }
    this.service
      .verSiExisteOrdenPorIdYPaciente(+this.orden, +this.paciente)
      .subscribe(
        (valido) => {
          console.log(valido);
          if (valido) {
            this.router.navigate([
              `/resultados/orden/${this.orden}/${this.paciente}`,
            ]);
          } else {
            Swal.fire('Error', 'No se han encontrado los resultados', 'error');
            this.limpiar();
          }
        },
        (error) => {
          Swal.fire('Error', 'No se han encontrado los resultados', 'error');
          this.limpiar();
        }
      );
  }

  private datosValidos(): boolean {
    console.log(this.orden, this.paciente);
    if (!this.orden) {
      return false;
    }
    if (!this.paciente) {
      return false;
    }
    if (this.noEsNumero(this.orden)) {
      return false;
    }
    if (this.noEsNumero(this.paciente)) {
      return false;
    }
    return true;
  }

  private noEsNumero(cadena: string): boolean {
    return !cadena.match(/^[0-9]+$/);
  }

  private limpiar(): void {
    this.orden = '';
    this.paciente = '';
  }
}
