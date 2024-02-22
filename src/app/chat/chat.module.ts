import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { PrincipalComponent } from './components/principal/principal.component';
import { SideBarChatsComponent } from './components/side-bar-chats/side-bar-chats.component';
import { ChatComponent } from './components/chat/chat.component';
  

@NgModule({
  declarations: [
    PrincipalComponent,
    SideBarChatsComponent,
    ChatComponent
    ],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
