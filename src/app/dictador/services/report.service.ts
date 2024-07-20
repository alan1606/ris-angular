import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import { BASE_ENDPOINT } from 'src/app/config/app';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseEndpoint = BASE_ENDPOINT + '/reports';
  private stompClient: Client;
  private messageSubject: BehaviorSubject<Message> = new BehaviorSubject<Message>(null);

  private cabeceras: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {
    this.initConnectionSocket();
  }

  private initConnectionSocket() {
    const url = 'https://ris.diagnocons.com:4300/api/reports/report-websocket'; // Asegúrate de que esta URL sea correcta
    //const url = 'http://localhost:8090/api/reports/report-websocket'; // Asegúrate de que esta URL sea correcta

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      connectHeaders: {},
      // debug: (str) => 
      // console.log(new Date(), str),
      // reconnectDelay: 5000,
      // heartbeatIncoming: 4000,
      // heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame) => {
      // console.log('Connected:');
    };

    this.stompClient.onStompError = (frame) => {
      // console.error('Broker reported error: ' + frame.headers['message']);
      // console.error('Additional details: ' + frame.body);
    };

    this.stompClient.onWebSocketClose = (evt) => {
      // console.log(`WebSocket closed with`);
    };

    this.stompClient.activate();
  }

  public joinTopic(idVenta: number) {
    // console.log(`Attempting to join topic: /topic/report/${idVenta}`);
    if (this.stompClient.connected) {
      this.subscribeToTopic(idVenta);
    } else {
      this.stompClient.onConnect = (frame) => {
        // console.log('WebSocket connected, subscribing to topic now.');
        this.subscribeToTopic(idVenta);
      };
    }
  }

  private subscribeToTopic(idVenta: number) {
    // console.log(`Subscribing to /topic/report/${idVenta}`);
    try {
      this.stompClient.subscribe(`/topic/report/${idVenta}`, (message: any) => {
        // console.log(`Received message from topic /topic/report/${idVenta}`);
        const messageContent = JSON.parse(message.body);
        this.messageSubject.next(messageContent);
      });
    } catch (error) {
      // console.error(`Error subscribing to topic /topic/report/${idVenta}:`, error);
    }
  }

  public getMessageSubject(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  public generateReport(body: string, idVentaConcepto: number): Observable<string> {
    return this.http.post<string>(`${this.baseEndpoint}/${idVentaConcepto}`, body);
  }
}
