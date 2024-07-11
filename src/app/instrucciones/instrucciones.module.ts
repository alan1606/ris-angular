import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstruccionesAreaComponent } from './components/instrucciones-area/instrucciones-area.component';
import { InstruccionesConceptoComponent } from './components/instrucciones-concepto/instrucciones-concepto.component';
import { InstruccionesInstitucionComponent } from './components/instrucciones-institucion/instrucciones-institucion.component';
import { InstruccionesRoutingModule } from './instrucciones-routing.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { InstruccionesAreaModalComponent } from './components/instrucciones-area-modal/instrucciones-area-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { InstruccionesInstitucionModalComponent } from './components/instrucciones-institucion-modal/instrucciones-institucion-modal.component';
import { InstruccionesConceptoModalComponent } from './components/instrucciones-concepto-modal/instrucciones-concepto-modal.component';

@NgModule({
  declarations: [
    InstruccionesAreaComponent,
    InstruccionesConceptoComponent,
    InstruccionesInstitucionComponent,
    InstruccionesAreaModalComponent,
    InstruccionesInstitucionModalComponent,
    InstruccionesConceptoModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    InstruccionesRoutingModule,
    MatSelectModule,
    MatDialogModule,
  ],
})
export class InstruccionesModule {}
