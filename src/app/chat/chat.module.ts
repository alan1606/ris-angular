import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { PrincipalComponent } from './components/principal/principal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PrincipalComponent
    ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule
  ]
})
export class ChatModule { }
