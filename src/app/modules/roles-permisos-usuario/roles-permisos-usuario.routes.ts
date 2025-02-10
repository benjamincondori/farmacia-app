import { Routes } from "@angular/router";
import { RolesPermisosUsuarioComponent } from "./roles-permisos-usuario.component";
import { RolesPermisosUsuariosAddComponent } from "./roles-permisos-usuarios-add/roles-permisos-usuarios-add.component";

export const RolesPermisosUsuario: Routes = [
  {
    path: '',
    component: RolesPermisosUsuarioComponent,
  },
  {
    path: 'asignar/:id',
    component: RolesPermisosUsuariosAddComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];