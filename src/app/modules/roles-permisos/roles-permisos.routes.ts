import { Routes } from "@angular/router";
import { RolesPermisosComponent } from "./roles-permisos.component";
import { RolesPermisosAddComponent } from "./roles-permisos-add/roles-permisos-add.component";

export const RolesPermisosRoutes: Routes = [
  {
    path: '',
    component: RolesPermisosComponent
  },
  {
    path: 'asignar/:id',
    component: RolesPermisosAddComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];