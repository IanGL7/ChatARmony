import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-accessibility-menu',
  templateUrl: './accessibility-menu.component.html',
  styleUrls: ['./accessibility-menu.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AccessibilityMenuComponent {
  public menuOpen = false;
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private isHighContrast = false;
  private currentFontSize = 16;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  toggleMenu(event: MouseEvent) {
    if (!this.isDragging) {
      this.menuOpen = !this.menuOpen;
      console.log("Menu toggled:", this.menuOpen);
    }
    event.stopPropagation();
  }


  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.offsetX = event.clientX - this.el.nativeElement.getBoundingClientRect().left;
    this.offsetY = event.clientY - this.el.nativeElement.getBoundingClientRect().top;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.stopDrag);
  }

  stopDrag = () => {
    if (this.isDragging) {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.stopDrag);
    }
  }

  onMouseMove = (event: MouseEvent) => {
    if (this.isDragging) {
      const newX = event.clientX - this.offsetX;
      const newY = event.clientY - this.offsetY;

      this.el.nativeElement.style.position = 'fixed';
      this.el.nativeElement.style.left = `${newX}px`;
      this.el.nativeElement.style.top = `${newY}px`;
    }
  }

  // Toggle contrast mode for high contrast display
  
  // Función toggleContrast para cambiar el contraste solo de los elementos de texto dentro de .chat-content
  toggleContrast() {
    const textElements = document.querySelectorAll('.chat-content p, .chat-content h1, .chat-content h2, .chat-content h3, .chat-content h4, .chat-content h5, .chat-content h6, .chat-content span, .chat-content label');
    this.isHighContrast = !this.isHighContrast;
    const color = this.isHighContrast ? '#FFF' : '#000';
    const backgroundColor = this.isHighContrast ? '#000' : 'transparent';

    textElements.forEach((element) => {
      (element as HTMLElement).style.color = color;
      (element as HTMLElement).style.backgroundColor = backgroundColor;
    });

    console.log("Contrast toggled for text elements only:", this.isHighContrast);
  }
  // Increase font size
  increaseFontSize() {
    this.currentFontSize += 2;
    this.applyFontSize();
    console.log("Font size increased:", this.currentFontSize);
  }

  // Decrease font size
  decreaseFontSize() {
    this.currentFontSize = Math.max(12, this.currentFontSize - 2);
    this.applyFontSize();
    console.log("Font size decreased:", this.currentFontSize);
  }

  private applyFontSize() {
    const chatContainers = document.querySelectorAll('.chat-content');
    chatContainers.forEach((chatContainer) => {
      (chatContainer as HTMLElement).style.fontSize = `${this.currentFontSize}px`;
    });
  }
  

  
  // Alterna entre leer o detener el texto seleccionado
readSelectedText() {
  const selectedText = window.getSelection()?.toString().trim();

  // Verificar si ya se está reproduciendo audio
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  } else if (selectedText) {
    const utterance = new SpeechSynthesisUtterance(selectedText);
    utterance.lang = 'es-ES';
    utterance.rate = 1;

    window.speechSynthesis.speak(utterance);
  } else {
    toast.success('Por favor selecciona el texto que deseas escuchar.');
  }
}

// Alterna entre leer o detener todo el texto en el contenedor .chat-content
readAllText() {
  const chatContainer = document.querySelector('.chat-content');
  const textToRead = chatContainer?.textContent?.trim();

  // Verificar si ya se está reproduciendo audio
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  } else if (textToRead) {
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 1;

    window.speechSynthesis.speak(utterance);
  } else {
    alert('No se encontró texto para leer.');
  }
}
}
