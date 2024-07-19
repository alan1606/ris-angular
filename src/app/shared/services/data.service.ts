import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Area } from 'src/app/models/area';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  private areaDataSubject = new BehaviorSubject<Area>(new Area());

  areaData$: Observable<any> = this.areaDataSubject.asObservable();



  updateAreaData(nuevaArea: Area) {
    console.log("area en el servicio")
    this.areaDataSubject.next(nuevaArea);
  }
}
