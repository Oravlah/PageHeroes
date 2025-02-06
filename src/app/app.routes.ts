import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard'; // esto se ocuparia mediante [authGuard] despues del path de la ruta de la pagina que se quiere proteger

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login/login.component')
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
