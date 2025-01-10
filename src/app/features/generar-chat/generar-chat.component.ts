import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenerarChatService } from './generar-chat.service';
import { HttpClientModule } from '@angular/common/http';
import { GenerarChatModule } from './generar-chat.module';
import { CommonModule } from '@angular/common';
import { AccessibilityMenuComponent } from '../../shared/accessibility-menu/accessibility-menu.component';
import { Router, RouterModule } from '@angular/router';
import { MenuLateralComponent } from '../../shared/menu-lateral/menu-lateral.component';
import { MatDialog } from '@angular/material/dialog';  // Para abrir el modal
import { SurveyComponent } from '../survey/survey.component';  // El componente de la encuesta
import { Auth } from '@angular/fire/auth';  // Para acceder a la autenticación de Firebase

interface Message {
  sender: 'user' | 'bot';
  text: string;
  isExercise?: boolean;  // Nuevo campo para identificar si el mensaje es un ejercicio
  exerciseName?: string; // Nombre del ejercicio si aplica
}

@Component({
  selector: 'app-generar-chat',
  standalone: true,
  imports: [FormsModule, GenerarChatModule, CommonModule, AccessibilityMenuComponent, RouterModule, MenuLateralComponent],
  templateUrl: './generar-chat.component.html',
  styleUrls: ['./generar-chat.component.css']
})
export class GenerarChatComponent implements OnInit {
  isMenuExpanded = false; // Estado para el menú lateral
  prompt = '';
  messages: Message[] = [
    { sender: 'bot', text: 'Hola, soy Armony! ¿En qué puedo ayudarte?' }
  ];

  constructor(
    private generarChatService: GenerarChatService,
    private router: Router,
    private dialog: MatDialog,  // Inyectar MatDialog
    private auth: Auth  // Inyectar Auth para obtener el userId
  ) {}

  ngOnInit(): void {
    // Restaurar estado del chat al cargar el componente
    const savedChatState = localStorage.getItem('chatState');
    if (savedChatState) {
      const chatState = JSON.parse(savedChatState);
      this.messages = chatState.messages || [];
      this.prompt = chatState.prompt || '';
    }

    // Verificar si el usuario regresa del AR y mostrar la encuesta
    const hasReturnedFromAR = sessionStorage.getItem('returnedFromAR');
    if (hasReturnedFromAR) {
      sessionStorage.removeItem('returnedFromAR'); // Restablecer la bandera

      // Verificar si el usuario está autenticado
      const userId = this.auth.currentUser?.uid;
      if (userId) {
        this.dialog.open(SurveyComponent, {
          width: '400px',
          data: { userId }
        });
      }
    }
  }
  
  saveChatState(): void {
    // Guardar el estado del chat en localStorage
    const chatState = {
      messages: this.messages,
      prompt: this.prompt,
    };
    localStorage.setItem('chatState', JSON.stringify(chatState));
  }

  // Método para manejar el evento del menú lateral
  onMenuToggled(expanded: boolean): void {
    this.isMenuExpanded = expanded;
  }

  onSubmit(): void {
    if (this.prompt.trim()) {
      // Agregar mensaje del usuario al array de mensajes
      this.messages.push({ sender: 'user', text: this.prompt });

      // Llamar al servicio para obtener la respuesta del bot
      this.generarChatService.getContent(this.prompt).subscribe(
        data => {
          const botMessage: Message = { sender: 'bot', text: data.content };

          // Verificar si la respuesta contiene una recomendación de ejercicio
          if (data.content.includes('Te recomiendo realizar el siguiente ejercicio en realidad aumentada')) {
            botMessage.isExercise = true;
            botMessage.exerciseName = this.extractExerciseName(data.content);
          }

          // Agregar respuesta del bot al array de mensajes
          this.messages.push(botMessage);
        },
        err => {
          // Manejar el error y mostrarlo en el chat
          this.messages.push({ sender: 'bot', text: 'Error: No se pudo obtener respuesta' });
        }
      );

      // Limpiar el campo de entrada
      this.prompt = '';
    }
  }

  // Función para extraer el nombre del ejercicio del mensaje
  private extractExerciseName(content: string): string {
    const match = content.match(/Te recomiendo realizar el siguiente ejercicio en realidad aumentada para calmarte: (.+)\./);
    return match ? match[1] : 'Ejercicio';
  }

  // Función para abrir el componente de AR
  openAR(exerciseName: string): void {
    this.saveChatState(); // Guardar estado antes de navegar
    this.router.navigate(['/ar-viewer'], { queryParams: { exercise: exerciseName } });

    // Establecer la bandera para mostrar la encuesta cuando regrese del AR
    sessionStorage.setItem('returnedFromAR', 'true');
  }
}
