import { Routes } from '@angular/router';

export const decommissionRoutes: Routes = [
  { path: '', loadComponent: () => import('./decommission.component').then(m => m.DecommissionComponent) }
];
