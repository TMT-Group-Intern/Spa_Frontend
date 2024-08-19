import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'frontend-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {

  user = '';
  message = '';
  messages: { user: string, message: string }[] = [];
  messageChats: { user: string, message: string, time: string }[] = [];
  userSession: any;
  userCurrent: '' | undefined;
  time: Date | undefined;

  constructor(private auth: AuthService,) { }

  ngOnInit() {
    this.auth.addTransferChatDataListener(this.onReceiveMessage.bind(this));
    const storedUserSession = localStorage.getItem('userSession');

    if (storedUserSession != null) {
      this.userSession = JSON.parse(storedUserSession);
      this.userCurrent = this.userSession.user.name
    }
    this.auth.getChat().subscribe((messages) => {
      this.messageChats = messages.map(m => {
        const messageTime = new Date(m.messageTime).toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });
        return {
          user: m.userName,
          message: m.content,
          time: messageTime
        };
      });
    });
  }

  onReceiveMessage(user: any, message: string) {
    this.messages.push({ user, message });
  }

  sendMessage() {
    this.time = new Date();
    this.auth.sendMessage(this.userCurrent as string, this.message);
    this.message = '';
  }
}
