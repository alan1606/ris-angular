import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstruccionesAreaComponent } from './components/instrucciones-area/instrucciones-area.component';
import { InstruccionesConceptoComponent } from './components/instrucciones-concepto/instrucciones-concepto.component';
import { InstruccionesInstitucionComponent } from './components/instrucciones-institucion/instrucciones-institucion.component';
import { InstruccionesRoutingModule } from './instrucciones-routing.module';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { InstruccionesAreaModalComponent } from './components/instrucciones-area-modal/instrucciones-area-modal.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import { InstruccionesInstitucionModalComponent } from './components/instrucciones-institucion-modal/instrucciones-institucion-modal.component';
import { InstruccionesConceptoModalComponent } from './components/instrucciones-concepto-modal/instrucciones-concepto-modal.component';


@NgModule({
  declarations: [
    InstruccionesAreaComponent,
    InstruccionesConceptoComponent,
    InstruccionesInstitucionComponent,
    InstruccionesAreaModalComponent,
    InstruccionesInstitucionModalComponent,
    InstruccionesConceptoModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    InstruccionesRoutingModule,
    MatSelectModule,
    MatDialogModule
  ]
})
export class InstruccionesModule { }
