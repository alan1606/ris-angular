import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from 'src/app/models/paciente';
import { PacientesService } from 'src/app/services/pacientes.service';
import { CommonFormComponent } from '../common-form.component';

@Component({
  selector: 'app-pacientes-form',
  templateUrl: './pacientes-form.component.html',
  styleUrls: ['./pacientes-form.component.css']
})
export class PacientesFormComponent extends CommonFormComponent<Paciente, PacientesService> implements OnInit {

  constructor(service: PacientesService,
    router: Router,
    route: ActivatedRoute) {
      
    super(service, router, route);
    this.titulo = "Crear pacientes";
    this.model = new Paciente();
    this.redirect = '/pacientes';
    this.nombreModel = Paciente.name;
  }
}
