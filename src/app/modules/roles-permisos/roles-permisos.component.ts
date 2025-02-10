import { ChangeDetectorRef, Component } from '@angular/core';
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { Permiso } from '../../interfaces/permiso.interface';
import { Rol } from '../../interfaces/rol.interface';
import { RolService } from '../rol/service/rol.service';
import { PermisoService } from '../permiso/service/permiso.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-permisos',
  imports: [PageHeaderComponent, CommonModule],
  templateUrl: './roles-permisos.component.html',
  styleUrl: './roles-permisos.component.css'
})
export class RolesPermisosComponent {

  data: any = {
    title: 'Roles con sus Permisos',
    subtitle: '',
    name: 'Roles con sus Permisos',
  };

  page: number = 1;
  limit: number = 10;
  
  roles: Rol[] = [];
  permisos: Permiso[] = [];

  constructor(
    private rolesService: RolService,
    private permisosService: PermisoService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.obtenerRoles();
    this.obtenerPermisos();
  }
  
  // Cargar los permisos
  obtenerPermisos(): void {
    this.permisosService.getPermisos().subscribe({
      next: (permisos) => {
        this.permisos = permisos;
        this.obtenerRoles();
      },
      error: (err) => {
        console.error('Error al obtener los permisos:', err);
        this.cdr.markForCheck();
      },
    });
  }
  
  // Cargar los roles
  obtenerRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        // Mapear los roles para incluir el nombre del permiso en lugar del ID
        this.roles = roles.map(rol => ({
          ...rol,
          rolPermisos: rol.rolPermisos?.map(permiso => ({
            ...permiso,
            nombrePermiso: this.permisos.find(p => p.iD_Permiso === permiso.iD_Permiso)?.nombre_Permiso
          }))
        }));

        console.log('Roles con nombres de permisos:', this.roles);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al obtener los roles:', err);
        this.cdr.markForCheck();
      },
    });
  }
  
  // Redirigir a la página de asignar permisos
  asignarPermisos(id: number): void {
    this.router.navigate(['/dashboard/roles-permisos/asignar', id]);
  }
  
}
