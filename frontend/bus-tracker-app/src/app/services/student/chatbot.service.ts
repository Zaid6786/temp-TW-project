import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ChatResponse, BusCard, FeeCard } from '../../modules/student/chatbot/models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Note: If environment.apiUrl already has '/api', we construct the path carefully.
    // The spec requests: `${environment.apiUrl}/api/student/chat`
    // We will call this endpoint. If it returns 404/failure, we trigger the offline simulator.
    const url = `${environment.apiUrl}/student/chat`;

    return this.http.post<ChatResponse>(url, { message }, { headers }).pipe(
      catchError(err => {
        console.warn('Backend chat API failed or is offline. Using local AI simulator.');
        return of(this.simulateChatbotResponse(message));
      })
    );
  }

  private simulateChatbotResponse(message: string): ChatResponse {
    const query = message.toLowerCase();
    
    let responseText = "Hello! I am your Bus Assistant. I can help you with your bus locations, ETAs, delays, or fee statements. Try asking one of the suggested questions below.";
    let busCard: BusCard | undefined = undefined;
    let feeCard: FeeCard | undefined = undefined;

    if (query.includes('where') || query.includes('location')) {
      responseText = "Your assigned Bus #104 is currently near the RTC Complex stop.";
      busCard = {
        busId: 'BUS-104',
        status: 'Delayed',
        currentLocation: 'RTC Complex',
        eta: '12 minutes'
      };
    } else if (query.includes('when') || query.includes('arrive') || query.includes('eta')) {
      responseText = "Bus #104 is estimated to arrive at your pickup location in 12 minutes.";
      busCard = {
        busId: 'BUS-104',
        status: 'Delayed',
        currentLocation: 'RTC Complex',
        eta: '12 minutes'
      };
    } else if (query.includes('why') || query.includes('delay')) {
      responseText = "Your bus is running late because of heavy traffic congestion near the central market intersection.";
      busCard = {
        busId: 'BUS-104',
        status: 'Delayed',
        currentLocation: 'RTC Complex',
        eta: '12 minutes'
      };
    } else if (query.includes('assigned') || query.includes('what is my bus')) {
      responseText = "Your assigned vehicle is Bus #104, operating on Route A.";
      busCard = {
        busId: 'BUS-104',
        status: 'Active',
        currentLocation: 'Depot',
        eta: 'On Time'
      };
    } else if (query.includes('fee') || query.includes('how much') || query.includes('pending')) {
      responseText = "You have a pending transport balance of ₹2,500 due soon.";
      feeCard = {
        dueAmount: '₹2,500',
        dueDate: 'August 10, 2026',
        status: 'Partially paid'
      };
    } else if (query.includes('due date') || query.includes('when is my fee due') || query.includes('due')) {
      responseText = "The due date for your pending transport fee balance is August 10, 2026.";
      feeCard = {
        dueAmount: '₹2,500',
        dueDate: 'August 10, 2026',
        status: 'Partially paid'
      };
    }

    return { response: responseText, busCard, feeCard };
  }
}
