import { ChangeDetectorRef, Component } from '@angular/core';
import { Permiso } from '../../../interfaces/permiso.interface';
import { Rol } from '../../../interfaces/rol.interface';
import { PermisoService } from '../../permiso/service/permiso.service';
import { RolService } from '../../rol/service/rol.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../../../shared/services/alerts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-roles-permisos-add',
  imports: [PageHeaderComponent, CommonModule],
  templateUrl: './roles-permisos-add.component.html',
  styleUrl: './roles-permisos-add.component.css',
})
export class RolesPermisosAddComponent {
  data: any = {
    title: 'Asignar Permisos',
    subtitle: '',
    name: 'Asignar Permisos',
  };

  permisos: Permiso[] = [];
  rol!: Rol;
  rolId!: number;
  selectedPermisos: Permiso[] | null = null;

  constructor(
    private permisoService: PermisoService,
    private alertService: AlertsService,
    private rolService: RolService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID del rol desde la ruta
    this.rolId = Number(this.route.snapshot.params['id']);
    this.obtenerRol();
    this.obtenerPermisos();
  }

  // Cargar los permisos
  obtenerPermisos(): void {
    this.permisoService.getPermisos().subscribe({
      next: (permisos) => {
        this.permisos = permisos;
        console.log('Permisos cargados:', permisos);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al obtener los permisos:', err);
        this.cdr.markForCheck();
      },
    });
  }

  // Cargar un rol por ID
  obtenerRol(): void {
    this.rolService.getRolById(this.rolId).subscribe({
      next: (rol) => {
        this.rol = rol;
        console.log('Rol cargado:', rol);

        // Verificar si el rol tiene permisos asignados
        if (this.rol.rolPermisos) {
          this.selectedPermisos = this.permisos.filter((p) =>
            this.rol.rolPermisos!.some((rp) => rp.iD_Permiso === p.iD_Permiso)
          );
        } else {
          this.selectedPermisos = [];
        }

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al obtener el rol:', err);
        this.cdr.markForCheck();
      },
    });
  }

  // Guardar los permisos asignados al rol
  guardarPermisos(): void {
    if (!this.rol || !this.selectedPermisos) {
      this.alertService.alertInfo(
        'No hay permisos seleccionados o no se ha cargado el rol.'
      );
      return;
    }

    console.log('Permisos seleccionados:', this.selectedPermisos);

    // 1. Filtrar permisos nuevos (los que no tienen iD_Rol_Permiso aún)
    const permisosNuevos = this.selectedPermisos.filter(
      (p) => !this.rol.rolPermisos?.some((rp) => rp.iD_Permiso === p.iD_Permiso)
    );

    // 2. Filtrar permisos eliminados (los que tienen iD_Rol_Permiso y ya no están en la lista seleccionada)
    const permisosEliminados =
      this.rol.rolPermisos?.filter(
        (rp) =>
          !this.selectedPermisos?.some((p) => p.iD_Permiso === rp.iD_Permiso)
      ) || [];

    if (permisosNuevos.length === 0 && permisosEliminados.length === 0) {
      alert('No hay cambios en los permisos.');
      return;
    }

    console.log('Permisos nuevos a insertar:', permisosNuevos);
    console.log('Permisos eliminados a borrar:', permisosEliminados);

    // 3. Construcción del objeto para la API
    const rolData = {
      iD_Rol: this.rol.iD_Rol,
      nombre_Rol: this.rol.nombre_Rol,
      descripcion: this.rol.descripcion,
      fecha_Creacion: this.rol.fecha_Creacion || new Date().toISOString(), // Usa la fecha existente si hay
      rolPermisos: permisosNuevos.map((p) => ({
        iD_Rol: this.rol.iD_Rol,
        iD_Permiso: p.iD_Permiso,
      })),
    };

    console.log('Datos a enviar:', rolData);

    const observables: any = [];

    if (permisosNuevos.length > 0) {
      permisosNuevos.forEach((permiso) => {
        const rolPermiso = {
          iD_Rol: this.rol.iD_Rol,
          iD_Permiso: permiso.iD_Permiso,
        };
        observables.push(this.rolService.createRolPerimo(rolPermiso));
      });
    }

    if (permisosEliminados.length > 0) {
      permisosEliminados.forEach((p) => {
        observables.push(this.rolService.deleteRolPermisos(p.iD_Rol_Permiso));
      });
    }

    Promise.all(observables.map((obs: Observable<any>) => obs.toPromise()))
      .then(() => {
        this.alertService.alertSuccess('Cambios guardados con éxito.');
        this.goToRolesPermisos();
      })
      .catch((error) => {
        console.error('Error al guardar cambios:', error);
      });
  }

  // Agregar o quitar un permiso de la lista de permisos seleccionados
  agregarPermiso(permiso: Permiso, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (!this.selectedPermisos) {
      this.selectedPermisos = [];
    }

    if (isChecked) {
      this.selectedPermisos.push(permiso);
    } else {
      this.selectedPermisos = this.selectedPermisos.filter(
        (p) => p.iD_Permiso !== permiso.iD_Permiso
      );
    }
  }

  // Verificar si un permiso está seleccionado
  isSelected(permisoId: number): boolean {
    return this.selectedPermisos
      ? this.selectedPermisos.some((p) => p.iD_Permiso === permisoId)
      : false;
  }

  // Redirigir a la página de roles y permisos
  goToRolesPermisos(): void {
    this.router.navigate(['/dashboard/roles-permisos']);
  }
}
