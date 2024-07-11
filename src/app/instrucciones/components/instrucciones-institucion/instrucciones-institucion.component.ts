import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Institucion } from 'src/app/models/institucion';
import { InstitucionService } from 'src/app/services/institucion.service';
import { InstruccionesInstitucionModalComponent } from '../instrucciones-institucion-modal/instrucciones-institucion-modal.component';

@Component({
  selector: 'app-instrucciones-institucion',
  templateUrl: './instrucciones-institucion.component.html',
  styleUrls: ['./instrucciones-institucion.component.css'],
})
export class InstruccionesInstitucionComponent implements OnInit {
  instituciones: Institucion[] = [];
  institucion: Institucion;

  constructor(
    private institucionService: InstitucionService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.institucionService
      .listar()
      .subscribe((instituciones) => (this.instituciones = instituciones));
  }

  openDialog(institucionId: number): void {
    this.institucionService
      .ver(institucionId)
      .subscribe((institucion) => (this.institucion = institucion));

    const dialogRef = this.dialog.open(InstruccionesInstitucionModalComponent, {
      data: { institucionId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.institucion.instrucciones = result;
        this.institucionService.editar(this.institucion).subscribe(
          (institucion) => {
            this.institucion = institucion;
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }
}
