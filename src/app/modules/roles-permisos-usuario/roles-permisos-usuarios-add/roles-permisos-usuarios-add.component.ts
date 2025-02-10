import { ChangeDetectorRef, Component } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { User } from '../../../interfaces/user.interface';
import { Rol } from '../../../interfaces/rol.interface';
import { UsuarioService } from '../../usuario/service/usuario.service';
import { RolService } from '../../rol/service/rol.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsService } from '../../../shared/services/alerts.service';
import { RolPermisoUsuario } from '../../../interfaces/rol-permiso-usuario.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-permisos-usuarios-add',
  imports: [PageHeaderComponent, FormsModule, CommonModule],
  templateUrl: './roles-permisos-usuarios-add.component.html',
  styleUrl: './roles-permisos-usuarios-add.component.css',
})
export class RolesPermisosUsuariosAddComponent {
  data: any = {
    title: 'Asignar Roles',
    subtitle: '',
    name: 'Asignar Roles',
  };

  user: User | undefined;
  userId!: number;

  selectedUser: number | null = null; // Usuario seleccionado
  selectedRoles: any[] = []; // Roles seleccionados
  asignaciones: any[] = []; // Asignaciones de usuario-rol

  roles: Rol[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private alertsService: AlertsService,
    private rolService: RolService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    // Obtener el ID del usuario desde la ruta
    this.userId = Number(this.route.snapshot.params['id']);
    this.obtenerUsuario();
    this.obtenerRoles();
  }

  // Cargar el usuario
  obtenerUsuario(): void {
    this.usuarioService.getUsuarioById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        console.log('Usuario cargado:', this.user);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
        this.cdr.markForCheck();
      },
    });
  }

  // Cargar los roles
  obtenerRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log('Roles:', this.roles);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al obtener los roles:', err);
        this.cdr.markForCheck();
      },
    });
  }

  // Asignar un roles a un usuario
  asignarRoles(): void {
    if (this.selectedUser && this.selectedRoles.length > 0) {
      this.selectedRoles.forEach((rol) => {
        this.asignaciones.push({
          userId: this.selectedUser,
          rol,
        });
      });
      console.log('Asignaciones:', this.asignaciones);
    } else {
      this.alertsService.alertInfo(
        'Debe seleccionar un usuario y al menos un rol'
      );
    }
  }
  
  // Alternar selección de roles
  toggleRoleSelection(rol: any) {
    const index = this.selectedRoles.findIndex(r => r.id === rol.id);
    if (index === -1) {
      this.selectedRoles.push(rol); // Si no está seleccionado, lo agrega
    } else {
      this.selectedRoles.splice(index, 1); // Si ya está, lo quita
    }
  }

  // Verificar si un rol está seleccionado
  isRoleSelected(rol: any): boolean {
    return this.selectedRoles.some(r => r.id === rol.id);
  }

  // Transformar los datos para enviarlos al servidor
  transformarDatos(userId: number, data: any[]): any {
    return {
      userId: userId,
      rolpermiso: data
        // .filter(item => item.userId === userId) // Filtramos por el userId específico
        .flatMap((item) => item.rol.rolPermisos) // Extraemos los permisos
        .map((permiso) => ({ iD_Rol_Permiso: permiso.iD_Rol_Permiso })), // Formateamos
    };
  }

  // Guardar los roles asignados
  guardarRoles(): void {
    // Construcción del objeto para la API
    const rolData = this.transformarDatos(this.userId, this.asignaciones);

    console.log('Datos a enviar:', rolData.rolpermiso);

    // Insertar nuevos permisos
    if (rolData.rolpermiso.length > 0) {
      rolData.rolpermiso.forEach((permiso: any) => {
        var rolpermisoUsuario: RolPermisoUsuario = {
          userId: this.userId,
          iD_Rol_Permiso: permiso.iD_Rol_Permiso,
        };

        console.log('Datos a enviar rolpermisoUsuario:', rolpermisoUsuario);

        this.rolService.createRolUsuario(rolpermisoUsuario).subscribe(
          (response) => console.log('Permiso insertado:', response),
          (error) => console.error('Error al insertar permiso:', error)
        );
      });
      this.alertsService.alertSuccess('Cambios guardados con éxito.');
      this.goToUsuarioRoles();
    }
  }
  
  // Redirigir a la página de usuario y roles
  goToUsuarioRoles(): void {
    this.router.navigate(['/dashboard/roles-permisos-usuario']);
  }
}
