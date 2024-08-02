import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorariosRoutingModule } from './horarios-routing.module';
import { PrincipalComponent } from './components/principal/principal.component';
import { HorarioFormComponent } from './components/horario-form/horario-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { GenerarCitasModalComponent } from './components/generar-citas-modal/generar-citas-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ApartarDiasComponent } from './components/apartar-dias/apartar-dias.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ApartarHorasComponent } from './components/apartar-horas/apartar-horas.component';
import { MatButtonModule } from '@angular/material/button';
import { LimitarInstitucionPorSalaComponent } from './components/limitar-institucion-por-sala/limitar-institucion-por-sala.component';
import { FormLimitarInstitucionPorSalaComponent } from './components/form-limitar-institucion-por-sala/form-limitar-institucion-por-sala.component';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
  declarations: [
    PrincipalComponent,
    HorarioFormComponent,
    GenerarCitasModalComponent,
    ApartarDiasComponent,
    ApartarHorasComponent,
    LimitarInstitucionPorSalaComponent,
    FormLimitarInstitucionPorSalaComponent,
  ],
  imports: [
    CommonModule,
    HorariosRoutingModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
})
export class HorariosModule {}
