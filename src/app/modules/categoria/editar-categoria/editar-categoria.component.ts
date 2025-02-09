import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from '../../../shared/services/alerts.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-editar-categoria',
  imports: [PageHeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './editar-categoria.component.html',
  styleUrl: './editar-categoria.component.css'
})
export class EditarCategoriaComponent {

  categoriaForm!: FormGroup;
  
    data: any = {
      title: 'Categorias',
      subtitle: 'Editar categoría',
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
  
    actualizarCategoria(): void {
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
