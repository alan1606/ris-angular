import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-count-down-watch',
  templateUrl: './count-down-watch.component.html',
  styleUrl: './count-down-watch.component.css',
})
export class CountDownWatchComponent implements OnInit {
  private tokenService = inject(TokenService);
  public time: number;
  public timeLeft: number = 0; // Tiempo restante en milisegundos
  interval: any;
  constructor() {}
  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown() {
    // Obtén el token y decodifica la fecha de expiración
    let token = this.tokenService.getRefreshToken();
    let decoded = this.tokenService.decode(token);
    let expireTime = new Date(decoded.exp * 1000); // Fecha de expiración en milisegundos

    // Calcula el tiempo restante
    this.timeLeft = expireTime.getTime() - new Date().getTime();

    // Inicia el intervalo para actualizar el countdown cada segundo
    this.interval = setInterval(() => {
      // Resta un segundo
      this.timeLeft -= 1000;

      // Si el tiempo restante llega a 0 o menos, detén el countdown
      if (this.timeLeft <= 0) {
        clearInterval(this.interval);
        this.timeLeft = 0; // Evitar valores negativos
        console.log('Token expirado');
      }
    }, 1000);
  }

  // Función para mostrar el tiempo en formato legible (mm:ss)
  formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
