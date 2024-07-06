import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from '../app-routing.module';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    NavbarComponent
  ],
  exports: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule
  ]
})
export class LayoutModule { }
