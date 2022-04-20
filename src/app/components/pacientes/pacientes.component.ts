import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { PacientesService } from 'src/app/services/pacientes.service';
import { CommonListarComponent } from '../common-listar.component';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent extends CommonListarComponent<Paciente, PacientesService> implements OnInit {

  constructor(service: PacientesService) {
    super(service);
    this.titulo = "Listado de pacientes";
    this.nombreModel = Paciente.name;
   }
 

}
