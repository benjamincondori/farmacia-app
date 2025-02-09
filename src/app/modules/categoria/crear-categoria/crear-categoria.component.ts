import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Router } from '@angular/router';
import { AlertsService } from '../../../shared/services/alerts.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-categoria',
  imports: [PageHeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './crear-categoria.component.html',
  styleUrl: './crear-categoria.component.css',
})
export class CrearCategoriaComponent {
  categoriaForm!: FormGroup;

  data: any = {
    title: 'Categorias',
    subtitle: 'Crear categoría',
    name: 'Categorias',
  };

  constructor(
    private router: Router,
    private alertsService: AlertsService,
    private validatorsService: ValidatorsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }

  guardarCategoria(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.categoriaForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.categoriaForm, field);
  }

  goToCategoriaList(): void {
    this.router.navigate(['/dashboard/categoria/list']);
  }
}
