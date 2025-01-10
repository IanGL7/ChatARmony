import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router, RouterOutlet } from '@angular/router';
import {NgxSonnerToaster} from 'ngx-sonner'
import { AccessibilityMenuComponent } from './shared/accessibility-menu/accessibility-menu.component';
import { AuthStateService } from './shared/data-access/auth-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSonnerToaster, AccessibilityMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
