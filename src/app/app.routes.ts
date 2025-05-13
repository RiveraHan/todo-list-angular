import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./tasks/task-board.component').then(m => m.TaskBoardComponent),
        canActivate: [authGuard]
      }
];
