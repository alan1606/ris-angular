import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditarPantallasComponent } from '../editar-pantallas/editar-pantallas.component';
import { Router } from '@angular/router';
import { PantallasService } from '../../services/pantallas.service';
import { DicomRoom } from '../../models/DicomRoom';

@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
  styleUrl: './pantallas.component.css',
})
export class PantallasComponent implements OnInit {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private pantallasService = inject(PantallasService);

  public displayedColumns: string[] = ['Area', 'Editar'];
  public dataSource: DicomRoom[] = [];

  constructor() {}
  ngOnInit(): void {
    this.pantallasService.findAllEnabled().subscribe(
      (data) => {
        console.log(data);
        // this.dataSource.push(data);
        this.dataSource = data;
      },
      (error) => console.log(error)
    );
  }
  agregarSalaModule(): void {
    this.dialog.open(EditarPantallasComponent, {});
  }

  editarSalaModal(dicomRomm: DicomRoom): void {
    const matDialog = this.dialog.open(EditarPantallasComponent, {
      data: dicomRomm,
    });
    matDialog.afterClosed().subscribe(nuevaSala => {
      if (nuevaSala) {
        // Encuentra el índice del objeto a actualizar
        const index = this.dataSource.findIndex(d => d.id === dicomRomm.id);
        
        if (index !== -1) {
          // Actualiza el objeto existente en lugar de añadir uno nuevo
          this.dataSource[index] = nuevaSala;
        }
        
        // Reasigna la dataSource para forzar la detección de cambios en la vista
        this.dataSource = [...this.dataSource];
      }
    });
  }

  ver(): void {
    this.router.navigate(['/pantallas/ver']);
  }
}
