import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()  // Quita providedIn: 'root'
export class GenerarChatService {
    sprinURL = 'https://armony-backend.onrender.com/chat';
    constructor(private httpClient: HttpClient) { }

    public getContent(prompt: string): Observable<any> {
      // Asegúrate de que los datos enviados están correctamente formateados como un objeto JSON
      return this.httpClient.post<any>(this.sprinURL, { prompt: prompt });
  }
}
