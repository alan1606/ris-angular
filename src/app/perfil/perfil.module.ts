import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilModalComponent } from './components/perfil-modal/perfil-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    PerfilModalComponent
  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PerfilModule { }
