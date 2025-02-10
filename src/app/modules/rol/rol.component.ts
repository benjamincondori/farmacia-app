import { Component } from '@angular/core';
import { AlertsService } from '../../shared/services/alerts.service';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Rol } from '../../interfaces/rol.interface';
import { RolService } from './service/rol.service';

@Component({
  selector: 'app-rol',
  imports: [
    PageHeaderComponent,
    DataTablesModule,
    CommonModule,
    NgxPaginationModule,
  ],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.css',
})
export class RolComponent {
  data: any = {
    title: 'Roles',
    subtitle: '',
    name: 'Roles',
  };

  page: number = 1;
  limit: number = 10;

  roles: Rol[] = [];

  constructor(
    private alertsService: AlertsService,
    private router: Router,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.obtenerRoles();
  }

  // Cargar los roles
  obtenerRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error al obtener los roles:', err);
        this.alertsService.alertError('Error al obtener los roles');
      },
    });
  }

  async confirmarEliminarRol(id: number): Promise<void> {
    const confirmed = await this.alertsService.showConfirmationDialog({
      title: 'Eliminar Rol',
      text: '¿Seguro que deseas eliminar el rol?',
    });
    if (confirmed) {
      this.eliminarRol(id);
    }
  }

  eliminarRol(id: number): void {
    this.rolService.deleteRol(id).subscribe({
      next: () => {
        this.alertsService.alertSuccess('El rol se eliminó correctamente');
        this.obtenerRoles();
      },
      error: (err) => {
        console.error('Error al eliminar el rol:', err);
        this.alertsService.alertError('Error al eliminar el rol');
      },
    });
  }

  // Cambiar la cantidad de usuarios por página
  changeLimit(event: any): void {
    this.limit = event.target.value;
  }

  // Filtrar roles por nombre
  searchTable(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.toLowerCase();

    if (searchTerm === '') {
      this.obtenerRoles();
    } else {
      // Filtrar los usuarios según el nombre
      this.roles = this.roles.filter(
        (rol) =>
          rol.nombre_Rol?.toLowerCase().includes(searchTerm) 
      );
    }
    this.page = 1;
  }

  // Ir a la página de creación de rol
  goToCreateRol(): void {
    this.router.navigate(['/dashboard/rol/create']);
  }

  // Ir a la página de edición de rol
  goToEditRol(id: number): void {
    this.router.navigate(['/dashboard/rol/edit', id]);
  }
}
