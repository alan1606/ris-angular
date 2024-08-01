import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Axios } from './index';
import { TurneroSubscription } from 'src/app/models/TurneroSubscription';
@Injectable({
  providedIn: 'root',
})
export class TurneroService {
  private axios = inject(Axios)
  private restUrl = BASE_ENDPOINT + '/turnero/suscripciones';

  public subscribeUserToRoom(user: string, roomId: number): Observable<unknown> {
    return this.axios.post<unknown>(`${this.restUrl}/usuario/${user}/sala/${roomId}`, {});
  }
  
  public findSubscriptionsByUser(user:string):Observable<TurneroSubscription[]>{
    return this.axios.get<TurneroSubscription[]>(`${this.restUrl}/usuario/${user}`)
  }

  public unsuscribeUserOfRoom(user:string, roomId:number):Observable<unknown>{
    return this.axios.get(`${this.restUrl}/usuario/${user}/sala/${roomId}`)
  }
}
