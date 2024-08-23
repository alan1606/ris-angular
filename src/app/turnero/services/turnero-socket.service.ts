import { inject, Injectable } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { AlertaService } from 'src/app/shared/services/alerta.service';
@Injectable({
  providedIn: 'root',
})
export class TurneroSocketService {
  notificationSound = new Audio('../../../assets/messanger.mp3');

  private tokenService = inject(TokenService);
  private alertaService = inject(AlertaService);
  private stompClient: Client;
  private messageSubject: BehaviorSubject<Message> =
    new BehaviorSubject<Message>(null);
  private username = this.tokenService.getUsername();
  constructor() {
    this.initConnectionSocket();
  }
  public repoducir(): void {
    this.notificationSound.play();
  }

  public init(): void {}

  private initConnectionSocket() {
    console.log('Iniciando conexión');
    //const url = 'https://ris.diagnocons.com/api/reports/report-websocket';
    const url = 'http://172.17.207.221:8002/shifts-websocket';

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      connectHeaders: {},
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected:');
      this.joinTopic();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.onWebSocketClose = (evt) => {
      console.log(`WebSocket closed with`);
      this.disconect();
    };

    this.stompClient.activate();
  }

  public joinTopic() {
    console.log(`Attempting to join topic: /topic/user/${this.username}`);
    if (this.stompClient.connected) {
      this.subscribeToTopic();
    } else {
      this.stompClient.onConnect = (frame) => {
        console.log('WebSocket connected, subscribing to topic now.');
        this.subscribeToTopic();
      };
    }
  }

  private subscribeToTopic() {
    console.log(`Subscribing to /topic/user/${this.username}`);
    try {
      this.stompClient.subscribe(
        `/topic/user/${this.username}`,
        (message: any) => {
          console.log(
            `Received message from topic /topic/user/${this.username}`
          );
          this.alertaService.pacientArrived();
          const content = JSON.parse(message.body);
          this.messageSubject.next(content);
          console.log(content);
          this.alertaService.pacientArrived(content.patientName, content.roomName, content.study);
        }
      );
    } catch (error) {
      console.error(
        `Error subscribing to topic /topic/user/${this.username}:`,
        error
      );
    }
  }

  public disconect(): void {
    this.stompClient.deactivate();
    console.log('socket desconectado');
  }
}
