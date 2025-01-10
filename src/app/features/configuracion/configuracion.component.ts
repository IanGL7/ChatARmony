import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar *ngIf
import { AuthService } from '../../auth/data-access/auth.service';
import { User } from '@angular/fire/auth';
import { MenuLateralComponent } from "../../shared/menu-lateral/menu-lateral.component";

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MenuLateralComponent], // Asegúrate de incluir CommonModule
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  isMenuExpanded = false;

  configForm: FormGroup;
  user: User | null = null;
  photoPreview: string | ArrayBuffer | null = null; // Vista previa de la imagen
  photoFile: File | null = null; // Almacena el archivo de la imagen seleccionada

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.configForm = this.fb.group({
      displayName: ['']
    });
  }

  // Método para manejar el evento del menú lateral
  onMenuToggled(expanded: boolean): void {
    this.isMenuExpanded = expanded;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.configForm.patchValue({
          displayName: user.displayName || ''
        });
        this.photoPreview = user.photoURL || null; // Muestra la foto de perfil actual
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.photoFile = file; // Guardar el archivo de imagen seleccionado
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result; // Mostrar la vista previa de la imagen
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.configForm.valid && this.user) {
      const { displayName } = this.configForm.value;
      let photoURL = this.user.photoURL;

      // Si se selecciona una nueva foto, subirla y obtener la URL
      if (this.photoFile) {
        try {
          photoURL = await this.authService.uploadProfilePhoto(this.photoFile);
        } catch (error) {
          console.error('Error al subir la foto:', error);
          return;
        }
      }

      // Convertir photoURL a undefined si es null
      this.authService.updateProfile({ displayName, photoURL: photoURL || undefined }).then(() => {
        console.log('Perfil actualizado');
      }).catch(error => {
        console.error('Error al actualizar el perfil:', error);
      });
    }
  }
}
