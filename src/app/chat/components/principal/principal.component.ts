import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '@stomp/stompjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  constructor(private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {
    this.chatService.initConnenctionSocket();
  }
  chats: string[] = [];
  chatSeleccionado = '';
  busqueda: string = null;
  chatsFiltrados: string[] = [];
  listaMensajes: Message[] = [];
  imagenesUrl={};

  ngOnInit(): void {
    this.chatService.joinWpTopic();
    this.listenerMessage();
    this.buscarChats();
  }
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe((mensaje: any) => {
      //Si recibido.phone == chatSeleccionado, meter mensaje nuevo, si no, mover lista de chats
      if (mensaje.phoneNumber == this.chatSeleccionado) {
        this.listaMensajes.push(mensaje);
      } else {
        this.chats = this.chats.filter((chat) => chat != mensaje.phoneNumber);
        this.chats = [mensaje.phoneNumber, ...this.chats];
      }
    });
  }
  filtrarChats() {
    this.chatsFiltrados = !this.busqueda
      ? this.chats
      : this.chats.filter((chat) => chat.includes(this.busqueda));
  }

  private buscarChats() {
    this.chatService.getContactsList().subscribe((contacts) => {
      this.chats = contacts;
      this.chatsFiltrados = contacts;
    });
  }

  entrarAlChat(chat: string) {
    console.log(chat);
    if (this.chatSeleccionado == chat) {
      return;
      //No buscar mensajes que ya están cargados
    }
    this.chatSeleccionado = chat;
    this.chatService.getMessagesByPhoneNumber(chat).subscribe((mensajes) => {
      this.listaMensajes = mensajes;
      console.log(this.listaMensajes);
      this.cargarImagenes(); 
    });
  }

  scrollToBottom() {
    const container = this.scrollContainer.nativeElement;
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }

  cargarImagenes() {
    this.listaMensajes.forEach((mensaje: any) => {
      if (mensaje.mediaId) {
        this.getImage(mensaje.mediaId);
      }
    });
  }

  getImage(mediaId: string) {
    this.chatService.getImage(mediaId).subscribe(
      (data) => {
        let objectURL = URL.createObjectURL(data);
        this.imagenesUrl[mediaId] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      (error) => {
        console.error('Error fetching image:', error);
      }
    );
  }

  obtenerUrlImagen(mediaId: string): any {
    return this.imagenesUrl[mediaId] || '';
  }
}
