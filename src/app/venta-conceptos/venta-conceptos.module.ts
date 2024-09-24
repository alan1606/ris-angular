import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentaConceptosRoutingModule } from './venta-conceptos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { QRCodeModule } from 'angularx-qrcode';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AntecedentesEstudioModalComponent } from './venta-conceptos/antecedentes-estudio-modal/antecedentes-estudio-modal.component';
import { EnviarEstudioDicomComponent } from './venta-conceptos/enviar-estudio-dicom/enviar-estudio-dicom.component';
import { VentaConceptosComponent } from './venta-conceptos/venta-conceptos.component';
import { WlPersonalComponent } from './wl-personal/wl-personal.component';


@NgModule({
  declarations: [    
    AntecedentesEstudioModalComponent,
    EnviarEstudioDicomComponent,
    VentaConceptosComponent,
    WlPersonalComponent
  ],
  imports: [
    CommonModule,
    VentaConceptosRoutingModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatTableModule,
    QRCodeModule,
    MatPaginatorModule,
    SharedModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatStepperModule,
    QRCodeModule,
    MatFormFieldModule,
  ]
})
export class VentaConceptosModule { }
