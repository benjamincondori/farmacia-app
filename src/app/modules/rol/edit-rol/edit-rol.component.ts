import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsService } from '../../../shared/services/alerts.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header.component";
import { CommonModule } from '@angular/common';
import { RolService } from '../service/rol.service';

@Component({
  selector: 'app-edit-rol',
  imports: [PageHeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-rol.component.html',
  styleUrl: './edit-rol.component.css',
})
export class EditRolComponent {
  rolForm!: FormGroup;
  rolId!: number;

  data: any = {
    title: 'Roles',
    subtitle: 'Editar rol',
    name: 'Roles',
  };

  constructor(
    private router: Router,
    private alertsService: AlertsService,
    private validatorsService: ValidatorsService,
    private route: ActivatedRoute,
    private rolService: RolService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde la ruta
    this.rolId = Number(this.route.snapshot.params['id']);
    
    // Inicializar el formulario
    this.rolForm = this.fb.group({
      nombre_Rol: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha_Creacion: [''],
    });
    
    if (this.rolId) {
      this.obtenerRol(this.rolId);
    }
  }

  // Actualizar un rol
  actualizarRol(): void {
    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }
    
    const rol = this.rolForm.value;
    rol.id_Rol = this.rolId;
    rol.fecha_Creacion = new Date().toISOString();
    
    this.rolService.updateRol(this.rolId, rol).subscribe((rol) => {
      if (rol) {
        console.log('Rol actualizado:', rol);
        this.alertsService.alertSuccess('Rol actualizado correctamente');
        this.goToRolList();
      } else {
        this.alertsService.alertError('No se pudo actualizar el rol');
      }
    });
    
  }
  
  // Obtener el rol por ID
  obtenerRol(id: number): void {
    this.rolService.getRolById(id).subscribe((rol) => {
      if (rol) {
        this.rolForm.patchValue(rol);
      } else {
        this.alertsService.alertError('No se pudo obtener el rol');
      }
    });
  }

  // Verificar si un campo es válido
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.rolForm, field);
  }

  // Obtener el mensaje de error de un campo
  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.rolForm, field);
  }

  // Redirigir a la lista de roles
  goToRolList(): void {
    this.router.navigate(['/dashboard/rol/list']);
  }
}
