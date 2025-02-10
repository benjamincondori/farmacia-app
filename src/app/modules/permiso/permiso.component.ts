import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { Permiso } from '../../interfaces/permiso.interface';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertsService } from '../../shared/services/alerts.service';
import { RolService } from '../rol/service/rol.service';
import { PermisoService } from './service/permiso.service';

@Component({
  selector: 'app-permiso',
  imports: [PageHeaderComponent, CommonModule, NgxPaginationModule],
  templateUrl: './permiso.component.html',
  styleUrl: './permiso.component.css',
})
export class PermisoComponent {
  data: any = {
    title: 'Permisos',
    subtitle: '',
    name: 'Permisos',
  };

  page: number = 1;
  limit: number = 10;

  permisos: Permiso[] = [];

  constructor(
    private alertsService: AlertsService,
    private permisoService: PermisoService
  ) {}

  ngOnInit(): void {
    this.obtenerPermisos();
  }

  // Cargar los permisos
  obtenerPermisos(): void {
    this.permisoService.getPermisos().subscribe({
      next: (permisos) => {
        this.permisos = permisos;
      },
      error: (err) => {
        console.error('Error al obtener los permisos:', err);
        this.alertsService.alertError('Error al obtener los permisos');
      },
    });
  }

  // Cambiar la cantidad de usuarios por página
  changeLimit(event: any): void {
    this.limit = event.target.value;
  }

  // Filtrar permisos por nombre
  searchTable(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.toLowerCase();

    if (searchTerm === '') {
      this.obtenerPermisos();
    } else {
      // Filtrar los usuarios según el nombre
      this.permisos = this.permisos.filter(
        (permiso) =>
          permiso.nombre_Permiso?.toLowerCase().includes(searchTerm) ||
          permiso.descripcion?.toLowerCase().includes(searchTerm)
      );
    }
    this.page = 1;
  }
}
