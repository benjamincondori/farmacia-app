import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.AuthRoutes),
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'categoria',
        loadChildren: () =>
          import('./modules/categoria/categoria.routes').then(
            (m) => m.CategoriaRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
