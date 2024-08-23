import { inject, Injectable } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TurneroSocketService {
  private tokenService = inject(TokenService);
  private stompClient: Client;
  private messageSubject: BehaviorSubject<Message> =
    new BehaviorSubject<Message>(null);
  private username = this.tokenService.getUsername();
  constructor() {
    this.initConnectionSocket();
  }

  public suscribeUser(): void {}

  private initConnectionSocket() {
    console.log('Iniciando conexión');
    //const url = 'https://ris.diagnocons.com/api/reports/report-websocket';
    const url = 'http://localhost:8002/shifts-websocket';

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      connectHeaders: {},
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected:');
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.onWebSocketClose = (evt) => {
      console.log(`WebSocket closed with`);
      this.disconect()
    };

    this.stompClient.activate();
  }

  public joinTopic(idVenta: number) {
    console.log(`Attempting to join topic: /topic/user/${this.username}`);
    if (this.stompClient.connected) {
      this.subscribeToTopic(idVenta);
    } else {
      this.stompClient.onConnect = (frame) => {
        console.log('WebSocket connected, subscribing to topic now.');
        this.subscribeToTopic(idVenta);
      };
    }
  }

  private subscribeToTopic(idVenta: number) {
    console.log(`Subscribing to /topic/user/${this.username}`);
    try {
      this.stompClient.subscribe(`/topic/user/${this.username}`, (message: any) => {
        console.log(`Received message from topic /topic/user/${this.username}`);
        const messageContent = JSON.parse(message.body);
        this.messageSubject.next(messageContent);
      });
    } catch (error) {
      console.error(
        `Error subscribing to topic /topic/user/${this.username}:`,
        error
      );
    }
  }

  public disconect(): void {
    this.stompClient.deactivate();
    console.log("socket desconectado")
  }
}
