import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { Axios } from './index';
import { TurneroSubscription } from 'src/app/models/TurneroSubscription';
import { Study } from 'src/app/models/study';

@Injectable({
  providedIn: 'root',
})
export class TurneroService {
  private axios = inject(Axios)
  private turneroUrl = BASE_ENDPOINT + '/turnero/suscripciones';
  private wsUrl= BASE_ENDPOINT
  
  public subscribeUserToRoom(user: string, roomId: number): Observable<unknown> {
    return this.axios.post<unknown>(`${this.turneroUrl}/usuario/${user}/sala/${roomId}`, {});
  }
  
  public findSubscriptionsByUser(user:string):Observable<TurneroSubscription[]>{
    return this.axios.get<TurneroSubscription[]>(`${this.turneroUrl}/usuario/${user}`)
  }

  public unsuscribeUserOfRoom(user:string, roomId:number):Observable<unknown>{
    return this.axios.get(`${this.turneroUrl}/usuario/${user}/sala/${roomId}`)
  }

  public getStudiesForArea():Observable<Study[]>{
    return this.axios.get<Study[]>(``)
  }
}
