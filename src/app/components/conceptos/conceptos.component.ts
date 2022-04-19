import { Component, OnInit } from '@angular/core';
import { Concepto } from 'src/app/models/concepto';
import { ConceptosService } from 'src/app/services/conceptos.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {

  conceptos: Concepto[];
  titulo: "Conceptos";


  constructor(private service: ConceptosService) { }

  ngOnInit(): void {
    this.service.listar().subscribe(conceptos => this.conceptos = conceptos);
  }

  public eliminar(concepto: Concepto): void {

    Swal.fire({
      title: 'Cuidado',
      text: `¿Seguro que desea elminar ${concepto.concepto}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(concepto.id).subscribe(() => {
          this.conceptos = this.conceptos.filter(c => c !== concepto);
          Swal.fire('Eliminado:', `Concepto ${concepto.concepto} eliminado con éxito`, "success");
        });
      }
    })

  }

}
