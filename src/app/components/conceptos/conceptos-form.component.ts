import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Concepto } from 'src/app/models/concepto';
import { ConceptosService } from 'src/app/services/conceptos.service';
import Swal from 'sweetalert2'
import { CommonFormComponent } from '../common-form.component';

@Component({
  selector: 'app-conceptos-form',
  templateUrl: './conceptos-form.component.html',
  styleUrls: ['./conceptos-form.component.css']
})

export class ConceptosFormComponent extends CommonFormComponent<Concepto, ConceptosService> implements OnInit {




  constructor(service: ConceptosService,
    router: Router,
    route: ActivatedRoute) {
      
    super(service, router, route);
    this.titulo = "Crear conceptos";
    this.model = new Concepto();
    this.redirect = '/conceptos';
    this.nombreModel = Concepto.name;
  }



}
