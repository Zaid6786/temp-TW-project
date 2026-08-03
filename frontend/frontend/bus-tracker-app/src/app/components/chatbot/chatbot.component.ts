import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  text: string;
  isUser: boolean;
}

@Component({
  selector: 'app-global-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class GlobalChatbotComponent implements AfterViewChecked {
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;
  
  isOpen = false;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isTyping = false;
  sessionId = 'student-' + Math.floor(Math.random() * 10000) + '-session';

  constructor(private http: HttpClient) {
    // Initial greeting
    this.messages.push({
      text: 'Hi there! I am the College Bus AI. How can I help you today?',
      isUser: false
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  scrollToBottom(): void {
    try {
      this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userText = this.newMessage.trim();
    this.messages.push({ text: userText, isUser: true });
    this.newMessage = '';
    this.isTyping = true;
    
    // Prepare minimal payload expected by FastAPI schema
    const payload = {
      session_id: this.sessionId,
      question: userText,
      student: {
        student_id: 1,
        student_name: 'Current User',
        registration_number: '2026C01'
      }
    };
    
    // Determine the GenAI API URL to use. If undefined, default to 8000.
    const genaiApiUrl = (environment as any).genaiUrl || 'http://localhost:8000';

    this.http.post<any>(`${genaiApiUrl}/api/v1/student-bus-chat`, payload).subscribe({
      next: (response) => {
        this.isTyping = false;
        this.messages.push({ text: response.answer, isUser: false });
      },
      error: (err) => {
        this.isTyping = false;
        console.error('Chatbot API error:', err);
        this.messages.push({ text: 'Sorry, I am having trouble connecting to the server. Please try again later.', isUser: false });
      }
    });
  }
}
