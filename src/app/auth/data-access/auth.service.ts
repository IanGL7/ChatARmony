import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  updateProfile // Importa updateProfile
} from '@angular/fire/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage'; // Importaciones para Firebase Storage
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);
  private _storage = getStorage(); // Inicializa Firebase Storage para subir fotos

  constructor() {}

  /**
   * Método para registrar un nuevo usuario usando correo electrónico y contraseña.
   * @param user Objeto con el correo electrónico y la contraseña del usuario.
   * @returns Promesa que resuelve con las credenciales del usuario registrado.
   */
  signUp(user: { email: string; password: string }) {
    return createUserWithEmailAndPassword(
      this._auth,
      user.email,
      user.password
    );
  }

  /**
   * Método para iniciar sesión con correo electrónico y contraseña.
   * @param user Objeto con el correo electrónico y la contraseña del usuario.
   * @returns Promesa que resuelve con las credenciales del usuario autenticado.
   */
  signIn(user: { email: string; password: string }) {
    return signInWithEmailAndPassword(this._auth, user.email, user.password);
  }

  /**
   * Método para iniciar sesión con Google.
   * @returns Promesa que resuelve con las credenciales del usuario autenticado con Google.
   */
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this._auth, provider);
  }

  /**
   * Observable que emite el usuario autenticado actual.
   * Este observable se actualiza automáticamente cuando cambia el estado de autenticación.
   * @returns Observable que emite el usuario de Firebase o null si no hay usuario autenticado.
   */
  get currentUser$(): Observable<FirebaseUser | null> {
    return new Observable((observer) => {
      this._auth.onAuthStateChanged((user) => observer.next(user));
    });
  }

  /**
   * Método para cerrar sesión.
   * @returns Promesa que se resuelve cuando el usuario cierra sesión exitosamente.
   */
  logout() {
    return this._auth.signOut();
  }

  /**
   * Método para subir una imagen de perfil a Firebase Storage y obtener la URL pública.
   * @param file Archivo de imagen a cargar.
   * @returns Promesa que se resuelve con la URL de descarga de la imagen.
   */
  async uploadProfilePhoto(file: File): Promise<string> {
    const storageRef = ref(this._storage, `profilePhotos/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef); // Obtiene y devuelve la URL de descarga
  }

  /**
   * Método para actualizar el perfil del usuario autenticado actual.
   * @param profileData Objeto con el nuevo displayName y/o photoURL.
   * @returns Promesa que se resuelve cuando el perfil se actualiza exitosamente.
   */
  updateProfile(profileData: { displayName?: string; photoURL?: string }): Promise<void> {
    const user = this._auth.currentUser;
    if (user) {
      return updateProfile(user, profileData);
    } else {
      return Promise.reject('No hay usuario autenticado');
    }
  }
}
