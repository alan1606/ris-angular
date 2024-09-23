import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PantallasRoutingModule } from './pantallas-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditarPantallasComponent } from './components/editar-pantallas/editar-pantallas.component';
import { PantallasComponent } from './components/pantallas/pantallas.component';
import { VerPantallasComponent } from './components/ver-pantallas/ver-pantallas.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
  declarations: [
    EditarPantallasComponent,
    PantallasComponent,
    VerPantallasComponent,
  ],
  imports: [
    CommonModule,
    PantallasRoutingModule,
    RouterModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule

  ],
})
export class PantallasModule {}
