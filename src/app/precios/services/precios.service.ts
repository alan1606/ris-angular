import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Concepto } from '../models/concepto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreciosService extends CommonService<Concepto>{

  constructor(http: HttpClient) {
    super(http);
   }
}
