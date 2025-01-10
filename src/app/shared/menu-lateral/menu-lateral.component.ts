import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/data-access/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-lateral.component.html',
})
export class MenuLateralComponent implements OnInit {
  user: User | null = null;
  isExpanded = false;
  showSettings = false; // Definición explícita como boolean
  @Output() menuToggled = new EventEmitter<boolean>();

  private router = inject(Router);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribir al usuario actual
    this.authService.currentUser$.subscribe(user => (this.user = user));
  }

  // Método para alternar el menú lateral
  toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
    this.menuToggled.emit(this.isExpanded);
  }

  // Método para alternar la visibilidad de los ajustes
  toggleSettings(): void {
    this.showSettings = !this.showSettings; // Alterna entre true y false
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout().then(() => this.router.navigateByUrl('/auth/sign-in'));
  }
}
