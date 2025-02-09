import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { AlertsService } from '../../shared/services/alerts.service';
import { Router } from '@angular/router';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-categoria',
  imports: [PageHeaderComponent, DataTablesModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  
  data: any = {
    title: 'Categorias',
    subtitle: '',
    name: 'Categorias'
  };
  
  dtOptions: Config = {};
  
  categorias = [
    { id: 1, nombre: 'Medicamentos', descripcion: 'Productos farmacéuticos' },
    { id: 2, nombre: 'Vitaminas', descripcion: 'Suplementos vitamínicos' },
    { id: 3, nombre: 'Cosméticos', descripcion: 'Productos de belleza' },
    { id: 4, nombre: 'Alimentos', descripcion: 'Productos alimenticios' },
    { id: 5, nombre: 'Higiene', descripcion: 'Productos de limpieza' },
    { id: 6, nombre: 'Otros', descripcion: 'Productos varios' },
  ];
  
  constructor(
    private alertsService: AlertsService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: '/assets/libs/datatables/spanish.json'
      }
    }
  }
  
  async confirmarEliminarCategoria(id: number): Promise<void> {
    
    // Buscar la categoría por id
    const categoria = this.categorias.find(categoria => categoria.id === id);
    
    if (!categoria) {
      this.alertsService.alertError('La categoría no existe');
      return;
    }
    
    const nombre = categoria.nombre;
    const confirmed = await this.alertsService.showConfirmationDialog({
      title: 'Eliminar Categoría',
      text: `¿Seguro que deseas eliminar la categoría "${nombre}"?`
    });
    
    if (confirmed) {
      this.eliminarCategoria(id);
    }
  }

  eliminarCategoria(id: number): void {
    this.categorias = this.categorias.filter(categoria => categoria.id !== id);
    this.alertsService.alertSuccess('La categoría se eliminó correctamente');
  }
  
  goToCreateCategoria(): void {
    this.router.navigate(['/dashboard/categoria/create']);
  }
  
  goToEditCategoria(id: number): void {
    this.router.navigate(['/dashboard/categoria/edit', id]);
  }
  
}
