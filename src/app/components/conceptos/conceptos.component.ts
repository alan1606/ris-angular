import { Component, OnInit, ViewChild } from '@angular/core';
import { Concepto } from 'src/app/models/concepto';
import { ConceptosService } from 'src/app/services/conceptos.service';
import Swal from 'sweetalert2'
import { CommonListarComponent } from '../common-listar.component';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})

export class ConceptosComponent
  extends CommonListarComponent<Concepto, ConceptosService> implements OnInit {

  constructor(service: ConceptosService) {
    super(service);
    this.titulo = "Conceptos";
    this.nombreModel = Concepto.name;
  }

}
