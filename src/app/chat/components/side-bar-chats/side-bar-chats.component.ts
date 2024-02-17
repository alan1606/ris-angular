import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-bar-chats',
  templateUrl: './side-bar-chats.component.html',
  styleUrls: ['./side-bar-chats.component.css'],
})
export class SideBarChatsComponent {
  @Output() mensajesEncontrados = new EventEmitter();

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

  entrarAlChat(id: number) {
    this.mensajes = this.listaMensajes.filter((mensajes) => mensajes.id === id);
    this.mensajesEncontrados.emit(this.mensajes);

  }
}
