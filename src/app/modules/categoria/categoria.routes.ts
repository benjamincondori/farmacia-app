import { Routes } from "@angular/router";
import { CategoriaComponent } from "./categoria.component";

export const CategoriaRoutes: Routes = [
  {
    path: "list",
    component: CategoriaComponent
  },
  {
    path: "**",
    redirectTo: "list",
    pathMatch: "full"
  }
];