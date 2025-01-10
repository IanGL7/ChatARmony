import { inject, Injectable } from '@angular/core';
import { Auth, authState, User, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private _auth = inject(Auth);

  // Observable del estado de autenticación del usuario
  get authState$(): Observable<User | null> {
    return authState(this._auth);
  }

  // Usuario actual
  get currentUser() {
    return this._auth.currentUser;
  }

  // Método para cerrar sesión con manejo de errores
  logOut() {
    return signOut(this._auth).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
