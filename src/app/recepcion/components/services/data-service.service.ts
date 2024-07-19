import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  private precioDataSubject = new BehaviorSubject<number>(0);
  public precioData$: Observable<any> = this.precioDataSubject.asObservable();

  public actualizarPrecio(nuevoPrecio: number) {
    this.precioDataSubject.next(nuevoPrecio);
  }
}
