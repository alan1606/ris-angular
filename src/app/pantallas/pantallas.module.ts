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
  ],
})
export class PantallasModule {}
