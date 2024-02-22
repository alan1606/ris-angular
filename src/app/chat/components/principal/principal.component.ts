import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit{
  //telefono: string = '6271437428';

  chats: string[] = [];
  chatSeleccionado = "";

  listaMensajes: Message[] = [];


  constructor(private chatService: ChatService){
    this.chatService.initConnenctionSocket();
  }

  ngOnInit(): void {
    this.chatService.joinWpTopic();
    this.listenerMessage();
    this.buscarChats();
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((mensaje: any) => {
      //Si recibido.phone == chatSeleccionado, meter mensaje nuevo, si no, mover lista de chats
      if(mensaje.phoneNumber == this.chatSeleccionado){
        this.listaMensajes.push(mensaje);
      }
      else{
        this.chats = this.chats.filter(chat => chat!=mensaje.phoneNumber);
        this.chats = [mensaje.phoneNumber, ...this.chats];
      }
    });
  }

  private buscarChats(){
    this.chatService.getContactsList().subscribe(contacts => {
      this.chats = contacts;
    });
  }

  entrarAlChat(chat: string){
    if(this.chatSeleccionado == chat){
      return;
      //No buscar mensajes que ya están cargados
    }
    this.chatSeleccionado = chat;
    this.chatService.getMessagesByPhoneNumber(chat).subscribe(mensajes =>{
      this.listaMensajes = mensajes;
    });
  }

}
