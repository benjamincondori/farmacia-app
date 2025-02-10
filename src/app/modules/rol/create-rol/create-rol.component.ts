import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from '../../../shared/services/alerts.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { RolService } from '../service/rol.service';

@Component({
  selector: 'app-create-rol',
  imports: [PageHeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './create-rol.component.html',
  styleUrl: './create-rol.component.css',
})
export class CreateRolComponent {
  rolForm!: FormGroup;

  data: any = {
    title: 'Roles',
    subtitle: 'Crear rol',
    name: 'Roles',
  };

  constructor(
    private router: Router,
    private alertsService: AlertsService,
    private validatorsService: ValidatorsService,
    private rolService: RolService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.rolForm = this.fb.group({
      nombre_Rol: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha_Creacion: [''],
    });
  }

  // Guardar un nuevo rol
  guardarRol(): void {
    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }
    
    const rol = this.rolForm.value;
    rol.fecha_Creacion = new Date().toISOString();
    
    this.rolService.createRol(rol).subscribe({
      next: () => {
        this.alertsService.alertSuccess('Rol creado correctamente');
        this.goToRolList();
      },
      error: (err) => {
        console.error('Error al guardar el rol:', err);
        this.alertsService.alertError('Error al guardar el rol');
      },
    });
  }

  // Validar si un campo es válido
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.rolForm, field);
  }

  // Obtener el mensaje de error de un campo
  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.rolForm, field);
  }

  // Redirigi a la lista de roles
  goToRolList(): void {
    this.router.navigate(['/dashboard/rol/list']);
  }
}
