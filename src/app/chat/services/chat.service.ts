import { Injectable } from '@angular/core';
import { Message, Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_ENDPOINT, chatSocket } from 'src/app/config/app';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private base: string = BASE_ENDPOINT + '/whatsapp-web';
  private stompClient: Client;
  private messageSubject: BehaviorSubject<Message> =
    new BehaviorSubject<Message>(null);
  constructor(private http: HttpClient) {}

  initConnenctionSocket() {
    const url = chatSocket;

    // const socket = new SockJS(url);
    // this.stompClient = Stomp.over(socket);
    console.log('Iniciando conexión chat socket service');

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      connectHeaders: {},
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: Chat soocket service');
      this.joinTopic();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.onWebSocketClose = (evt) => {
      console.log(`Chat socket service closed with`);
      this.disconect();
    };

    this.stompClient.activate();
  }

  // joinWpTopic() {
  //   this.stompClient.connect({}, () => {
  //     this.stompClient.subscribe(`/topic/wp`, (messages: any) => {
  //       const messageContent = JSON.parse(messages.body);
  //       this.messageSubject.next(messageContent);
  //     });
  //   });
  // }

  public joinTopic() {
    if (this.stompClient.connected) {
      this.subscribeToTopic();
    } else {
      this.stompClient.onConnect = (frame) => {
        console.log('Chat socket connected, subscribing to topic wp now.');
        this.subscribeToTopic();
      };
    }
  }

  private subscribeToTopic() {
    try {
      this.stompClient.subscribe(`/topic/wp`, (message: any) => {
        const content = JSON.parse(message.body);
        this.messageSubject.next(content);
      });
    } catch (error) {
      console.error(`Error subscribing to topic /topic/wp`, error);
    }
  }

  public getMessageSubject(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  public getContactsList(): Observable<string[]> {
    return this.http.get<string[]>(this.base + '/contacts');
  }

  public getMessagesByPhoneNumber(phone: string): Observable<Message[]> {
    return this.http.get<Message[]>(this.base + '/messages/phone/' + phone);
  }

  public getImage(mediaId: string): Observable<Blob> {
    return this.http.get(`${this.base}/messages/image/${mediaId}`, {
      responseType: 'blob',
    });
  }

  public disconect(): void {
    this.stompClient.deactivate();
    console.log('Chat socket desconectado');
  }
}
