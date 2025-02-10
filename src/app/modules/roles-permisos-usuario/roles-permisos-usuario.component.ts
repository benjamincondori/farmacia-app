import { ChangeDetectorRef, Component } from '@angular/core';
import { UsuarioService } from '../usuario/service/usuario.service';
import { User } from '../../interfaces/user.interface';
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles-permisos-usuario',
  imports: [PageHeaderComponent, CommonModule],
  templateUrl: './roles-permisos-usuario.component.html',
  styleUrl: './roles-permisos-usuario.component.css',
})
export class RolesPermisosUsuarioComponent {
  data: any = {
    title: 'Usuarios con sus Roles',
    subtitle: '',
    name: 'Usuarios con sus Roles',
  };
  
  usuarios: User[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }
  
  // Cargar los usuarios
  obtenerUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        console.log('Usuarios:', this.usuarios);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al obtener los usuarios:', err);
        this.cdr.markForCheck();
      },
    });
  }
  
  // Redirigir a la vista de asignar roles
  asignarRoles(id: number): void {
    this.router.navigate(['/dashboard/roles-permisos-usuario/asignar', id]);
  }
}
