import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditarPantallasComponent } from '../editar-pantallas/editar-pantallas.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styleUrl: './pantallas.component.css',
})
export class PantallasComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  constructor() {}
  abrirEditorModule(): void {
    this.dialog.open(EditarPantallasComponent, {});
  }

  ver(): void {
    this.router.navigate(['/pantallas/ver']);
  }
}
