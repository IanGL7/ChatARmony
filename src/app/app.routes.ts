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
        loadComponent:() => import('./shared/ui/layout.component'),
        loadChildren: () => import ('./home/features/conversacion.routes'),
    },
    {
        path: '**',
        redirectTo: '/home',
    },
];
