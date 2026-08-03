export interface BusCard {
  busId: string;
  status: string;
  currentLocation: string;
  eta: string;
}

export interface FeeCard {
  dueAmount: string;
  dueDate: string;
  status: string;
}

export interface Message {
  role: 'student' | 'assistant';
  text: string;
  timestamp: Date;
  busCard?: BusCard;
  feeCard?: FeeCard;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  busCard?: BusCard;
  feeCard?: FeeCard;
}
