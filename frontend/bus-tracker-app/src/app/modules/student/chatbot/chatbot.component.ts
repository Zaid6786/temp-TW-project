import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatbotService } from '../../../services/student/chatbot.service';
import { Message, ChatResponse } from './models/chat.models';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatHistory') private chatHistoryContainer!: ElementRef;

  messages: Message[] = [];
  userInput: string = '';
  loading: boolean = false;
  error: string = '';

  suggestedQuestions: string[] = [
    'Where is my bus?',
    'When will it arrive?',
    'Why is it delayed?',
    'What is my assigned bus?',
    'How much fee is pending?',
    'When is my fee due?'
  ];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // Welcome message
    this.messages.push({
      role: 'assistant',
      text: 'Hello! I am your Bus Assistant. How can I help you today?',
      timestamp: new Date()
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage(text?: string) {
    const messageText = (text || this.userInput).trim();
    if (!messageText || this.loading) {
      return;
    }

    // Push student message
    this.messages.push({
      role: 'student',
      text: messageText,
      timestamp: new Date()
    });

    if (!text) {
      this.userInput = '';
    }

    this.loading = true;
    this.error = '';

    this.chatbotService.sendMessage(messageText).subscribe({
      next: (response: ChatResponse) => {
        this.loading = false;
        this.messages.push({
          role: 'assistant',
          text: response.response,
          timestamp: new Date(),
          busCard: response.busCard,
          feeCard: response.feeCard
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to retrieve chatbot response. Please try again.';
        console.error(err);
      }
    });
  }

  selectSuggestedQuestion(question: string) {
    this.sendMessage(question);
  }

  private scrollToBottom(): void {
    try {
      this.chatHistoryContainer.nativeElement.scrollTop = this.chatHistoryContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
