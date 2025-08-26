import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class GenerarChatService {
  private readonly sprinURL = '/api/chat';   // ← usa el rewrite de Vercel
  constructor(private httpClient: HttpClient) {}
  getContent(prompt: string) { return this.httpClient.post<any>(this.sprinURL, { prompt }); }
}
