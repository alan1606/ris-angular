import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditarPantallasComponent } from '../editar-pantallas/editar-pantallas.component';
import { Router } from '@angular/router';
import { PantallasService } from '../../services/pantallas.service';

@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styleUrl: './pantallas.component.css',
})
export class PantallasComponent implements OnInit {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private pantallasService = inject(PantallasService);
  constructor() {}
  ngOnInit(): void {
    this.pantallasService.findAllEnabled().subscribe(
      (data) => {
        console.log(data);
      },
      (error) => console.log(error)
    );
  }
  agregarSalaModule(): void {
    this.dialog.open(EditarPantallasComponent, {});
  }

  ver(): void {
    this.router.navigate(['/pantallas/ver']);
  }
}
