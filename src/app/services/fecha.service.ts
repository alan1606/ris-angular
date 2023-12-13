import { Injectable } from '@angular/core';
import { toDate } from 'date-fns-tz';
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class FechaService {
  private formatoEntrada = 'd/M/yyyy';
  private formatoSalida = 'yyyy-MM-dd';

  constructor() {}

  private parsearFecha(fechaString: string): Date {
    return parse(fechaString, this.formatoEntrada, new Date(), { locale: es });
  }

  public formatearFecha(fecha: Date): string {
    return format(fecha, this.formatoSalida);
  }

  alistarFechaParaBackend(fechaString: string): string{
    const fechaDate = this.parsearFecha(fechaString);
    return this.formatearFecha(fechaDate);
  }
}
