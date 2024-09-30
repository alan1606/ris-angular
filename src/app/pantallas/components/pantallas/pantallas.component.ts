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

  ngOnInit(): void {
    this.searchEnabledRooms();
  }

  public searchEnabledRooms(): void {
    this.pantallasService.findAllEnabled().subscribe(
      (data) => {
        console.log(data);
        this.dataSource = data;
      },
      (error) => console.log(error)
    );
  }
  public agregarSalaModule(): void {
    const matDialog = this.dialog.open(EditarPantallasComponent, {
      width: '350px',
    });
    matDialog.afterClosed().subscribe(() => {
      this.searchEnabledRooms();
    });
  }

  public editarSalaModal(dicomRomm: DicomRoom): void {
    const matDialog = this.dialog.open(EditarPantallasComponent, {
      width: '250px',
      data: dicomRomm,
    });
    matDialog.afterClosed().subscribe((nuevaSala: DicomRoom) => {
      if (!nuevaSala.enabled) {
        this.dataSource = this.dataSource.filter(
          (sala) => sala.id !== nuevaSala.id
        );
        return;
      }

      if (nuevaSala) {
        const index = this.dataSource.findIndex((d) => d.id === dicomRomm.id);

        if (index !== -1) {
          this.dataSource[index] = nuevaSala;
        }
        this.dataSource = [...this.dataSource];
      }
    });
  }

  public ver(): void {
    this.router.navigate(['/pantallas/ver']);
  }
}
