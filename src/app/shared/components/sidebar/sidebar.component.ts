import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  submenuOpen = false; // Estado del submenú

  toggleSubmenu(event: Event) {
    event.preventDefault();
    this.submenuOpen = !this.submenuOpen;
  }
}
