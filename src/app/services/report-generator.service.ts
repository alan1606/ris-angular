import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_ENDPOINT } from '../config/app';
import { BehaviorSubject, Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
@Injectable({
  providedIn: 'root',
})
export class ReportGeneratorService {
  private baseUrl: string = '';
  private stompClient: any
  private conclusionSubject:BehaviorSubject<string> = new BehaviorSubject<string>(null)

  constructor(private http: HttpClient) {
    this.baseUrl = `${BASE_ENDPOINT}/report-generator`;
  }

  public generarConclusion(idVentaConcepto: number, reporte:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${idVentaConcepto}`, {reporte:reporte});
  }

  public initConnenctionSocket() {
    const url = 'https://ris.diagnocons.com:4300/api/report-generator/report-websocket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket)
  }

  public joinConclusionTopic() {
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/report`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        this.conclusionSubject.next(messageContent);
      })
    })
  }

  public getConclusionSubject():Observable<string>{
    return this.conclusionSubject.asObservable();
  }
}
