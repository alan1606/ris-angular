import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any
  private messageSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() { 
    this.initConnenctionSocket();
  }

  initConnenctionSocket() {
    const url = 'https://ris.diagnocons.com:4300/api/whatsapp-web/wp-web-websocket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket)
  }

  joinWpTopic() {
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/wp`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);

        this.messageSubject.next(currentMessage);

      })
    })
  }

  /*sendMessage(roomId: string, chatMessage: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
  }*/

  getMessageSubject(){
    console.log("getee");
    return this.messageSubject.asObservable();
  }
}
