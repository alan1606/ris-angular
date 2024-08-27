import { inject, Injectable } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertaService } from 'src/app/shared/services/alerta.service';
@Injectable({
  providedIn: 'root',
})
export class TurneroSocketService {
  public notificationSound = new Audio('../../../assets/messanger.mp3');

  private tokenService = inject(TokenService);
  private alertaService = inject(AlertaService);

  private stompClient: Client;
  private messageSubject: BehaviorSubject<Message> = new BehaviorSubject<Message>(null);
  private username = this.tokenService.getUsername();
  private tecnico = this.tokenService.isTechnician() || this.tokenService.isAdmin();

  public nuevoEvento$: Observable<any> = this.messageSubject.asObservable();

  constructor() {
  }
  public repoducir(): void {
    this.notificationSound.play();
  }

  public init(): void {}

  public initConnectionSocket() {
    if(this.username==="" || !this.username){
      return
    }

    if(!this.tecnico){
      return
    }
    
    console.log('Iniciando conexión');
    //const url = 'https://ris.diagnocons.com/api/turnero/shifts-websocket';
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
          const content = JSON.parse(message.body);
          console.log(content)
          this.messageSubject.next(content);
          if (!content.user) {
            this.alertaService.pacientArrived(
              content.patientName,
              content.roomName,
              content.study
            );
          }
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
