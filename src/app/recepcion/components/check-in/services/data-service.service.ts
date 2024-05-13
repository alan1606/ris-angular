import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  private precioDataSubject = new BehaviorSubject<number>(0);

  precioData$: Observable<any> = this.precioDataSubject.asObservable();

  public actualizarPrecio(nuevoPrecio: number) {
    console.log('actualizando precio');
    this.precioDataSubject.next(nuevoPrecio);
  }
}
