import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CortesRoutingModule } from './cortes-routing.module';
import { TurnosComponent } from './components/turnos/turnos.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AgregarTurnosModalComponent } from './components/agregar-turnos-modal/agregar-turnos-modal.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    TurnosComponent,
    AgregarTurnosModalComponent
  ],
  imports: [
    CommonModule,
    CortesRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule
  ]
})
export class CortesModule { }
