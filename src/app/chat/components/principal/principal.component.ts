import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit{
  mensajesEncontrados:any;
  telefono: string = '6271437428';
  chats: {}[] = [
    { id: 1, numero: '6271437428' },
    { id: 2, numero: '6271131171' },
    { id: 3, numero: '6272790112' },
    { id: 4, numero: "6275219128" },
  ];
  //"6271437428","6271131171","6272790112"
  listaMensajes = [
    { id: 1, numero: '6271437428', mensaje: 'mensaje de juan' },
    { id: 2, numero: '6271131171', mensaje: 'mensaje de emmanuel' },
    { id: 4, numero: "6275219128", mensaje: 'mensaje de un pendejo' },
    { id: 3, numero: "6272790112", mensaje: 'mensaje de alan' },
  ];
  mensajes = null;
  item:any;


  messageList: any[] = [];


  constructor(private chatService: ChatService){
    this.chatService.initConnenctionSocket();
  }
  ngOnInit(): void {
    this.chatService.joinWpTopic();
  }

  enviarMensajesEncontradosParaMostrar(e:any) {
    this.mensajesEncontrados = e;
  }

  lisenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      console.log( "aaaaaaaaaaaa");

      console.log( messages);
      this.messageList = messages.map((item: any)=> ({
        ...item
      }))
      console.log(this.messageList);
    });
  }
}
