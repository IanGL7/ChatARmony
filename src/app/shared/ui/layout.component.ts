import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthStateService } from '../data-access/auth-state.service';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';

@Component({
  standalone: true,
  imports: [RouterModule, RouterLink, MenuLateralComponent],
  selector: 'app-layout',
  template: `
    <div class="flex">
      <!-- Menú lateral -->
      <app-menu-lateral></app-menu-lateral>

      <!-- Contenido principal -->
      <div class="flex-1 p-4">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class LayoutComponent {
  private _authState = inject(AuthStateService);
  private _router = inject(Router);

  async logOut() {
    await this._authState.logOut();
    this._router.navigateByUrl('/auth/sign-in');
  }
}
