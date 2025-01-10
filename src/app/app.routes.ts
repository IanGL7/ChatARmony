import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    canActivateChild: [publicGuard()],
    path: 'auth',
    loadChildren: () => import('./auth/features/auth.routes')
  },
  {
    canActivateChild: [privateGuard()],
    path: 'home',
    loadComponent: () => import('./shared/ui/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: 'generar-chat', loadComponent: () => import('./features/generar-chat/generar-chat.component').then(m => m.GenerarChatComponent) },
      { path: 'comentarios', loadComponent: () => import('./features/comentarios/comentarios.component').then(m => m.ComentariosComponent) },
      { path: 'biblioteca', loadComponent: () => import('./features/biblioteca/biblioteca.component').then(m => m.BibliotecaComponent) },
      { path: 'guardados', loadComponent: () => import('./features/guardados/guardados.component').then(m => m.GuardadosComponent) },
      { path: 'favoritos', loadComponent: () => import('./features/favoritos/favoritos.component').then(m => m.FavoritosComponent) },
      { path: 'historial', loadComponent: () => import('./features/historial/historial.component').then(m => m.HistorialComponent) },
      { path: 'configuracion', loadComponent: () => import('./features/configuracion/configuracion.component').then(m => m.ConfiguracionComponent) },
      { path: '', redirectTo: 'generar-chat', pathMatch: 'full' } // Ruta por defecto
    ]
  },

  // Aquí agregamos la ruta para el componente AR Viewer
  { path: 'ar-viewer', loadComponent: () => import('./features/ar-viewer/ar-viewer.component').then(m => m.ArViewerComponent) },
  
  { path: '**', redirectTo: '/home' }
];
