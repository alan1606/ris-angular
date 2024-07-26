import { Injectable } from '@angular/core';
import { Message, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_ENDPOINT } from 'src/app/config/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private base: string = BASE_ENDPOINT + "/whatsapp-web";
  private stompClient: any
  private messageSubject: BehaviorSubject<Message> = new BehaviorSubject<Message>(null);

  constructor(private http: HttpClient) {}

  initConnenctionSocket() {
    const url = 'https://ris.diagnocons.com/api/whatsapp-web/wp-web-websocket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket)
  }

  joinWpTopic() {
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/wp`, (messages: any) => {
        const messageContent = JSON.parse(messages.body);
        this.messageSubject.next(messageContent);
      })
    })
  }

  getMessageSubject(): Observable<Message>{
    return this.messageSubject.asObservable();
  }

  getContactsList(): Observable<string[]>{
    return this.http.get<string[]>(this.base+"/contacts");
  }

  getMessagesByPhoneNumber(phone: string): Observable<Message[]>{
    return this.http.get<Message[]>(this.base+"/messages/phone/"+phone);
  }
  
  getImage(mediaId: string): Observable<Blob> {
    return this.http.get(`${this.base}/messages/image/${mediaId}`, { responseType: 'blob' });
  }
}
