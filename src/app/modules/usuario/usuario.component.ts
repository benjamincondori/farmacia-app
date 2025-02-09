import { Component } from '@angular/core';
import { Config } from 'datatables.net';
import { AlertsService } from '../../shared/services/alerts.service';
import { Router } from '@angular/router';
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-usuario',
  imports: [PageHeaderComponent, DataTablesModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  data: any = {
    title: 'Usuarios',
    subtitle: '',
    name: 'Usuarios',
  };

  dtOptions: Config = {};

  usuarios = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@gmail.com',
      telefono: '1234567890',
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'López',
      email: 'juan@gmail.com',
      telefono: '0987654321',
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'Ramírez',
      email: 'juan@gmail.com',
      telefono: '1230984567',
    },
    {
      id: 4,
      nombre: 'Ana',
      apellido: 'Martínez',
      email: 'juan@gmail.com',
      telefono: '0981234567',
    },
    {
      id: 5,
      nombre: 'Pedro',
      apellido: 'Gómez',
      email: 'juan@gmail.com',
      telefono: '1234560987',
    },
    {
      id: 6,
      nombre: 'Laura',
      apellido: 'Torres',
      email: 'juan@gmail.com',
      telefono: '0987651098',
    },
  ];

  constructor(private alertsService: AlertsService, private router: Router) {}

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: '/assets/libs/datatables/spanish.json',
      },
    };
  }

  async confirmarEliminarUsuario(id: number): Promise<void> {
    // Buscar la usuario por id
    const usuario = this.usuarios.find((usuario) => usuario.id === id);

    if (!usuario) {
      this.alertsService.alertError('El usuario no existe');
      return;
    }

    const nombre = usuario.nombre;
    const confirmed = await this.alertsService.showConfirmationDialog({
      title: 'Eliminar Cliente',
      text: `¿Seguro que deseas eliminar el usuario "${nombre}"?`,
    });

    if (confirmed) {
      this.eliminarUsuario(id);
    }
  }

  eliminarUsuario(id: number): void {
    this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id);
    this.alertsService.alertSuccess('El usuario se eliminó correctamente');
  }

  goToCreateUsuario(): void {
    this.router.navigate(['/dashboard/usuario/create']);
  }

  goToEditUsuario(id: number): void {
    this.router.navigate(['/dashboard/usuario/edit', id]);
  }
}
