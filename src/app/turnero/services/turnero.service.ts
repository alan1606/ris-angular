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
  private subscriptionsUrl = BASE_ENDPOINT + '/turnero/suscripciones';
  private worklistsUrl = BASE_ENDPOINT + '/turnero/lista-trabajo';
  private takeStudyUrl = BASE_ENDPOINT + '/turnero/tomar';
  private studiesIdsUrl = BASE_ENDPOINT + '/turnero/estudios';
  
  public subscribeUserToRoom(user: string, roomId: number): Observable<void> {
    return this.axios.post<void>(`${this.subscriptionsUrl}/usuario/${user}/sala/${roomId}`, {});
  }
  
  public findSubscriptionsByUser(user:string):Observable<TurneroSubscription[]>{
    return this.axios.get<TurneroSubscription[]>(`${this.subscriptionsUrl}/usuario/${user}`)
  }

  public unsuscribeUserOfRoom(user:string, roomId:number):Observable<void>{
    return this.axios.delete<void>(`${this.subscriptionsUrl}/usuario/${user}/sala/${roomId}`)
  }

  public getStudiesForArea():Observable<Study[]>{
    return this.axios.get<Study[]>(``)
  }

  public workListByRoomId(roomId:number):Observable<any>{
    return this.axios.get(`${this.worklistsUrl}/${roomId}`)
  }

  public takeStudy(studyId:number, user:string):Observable<any>{
    return this.axios.post<any>(`${this.takeStudyUrl}/${studyId}/usuario/${user}`, {})
  }

  public findStudiesIdsWhereUserProcessingEqualsUserInToken(): Observable<number[]>{
    return this.axios.get<number[]>(this.studiesIdsUrl);
  }
}
