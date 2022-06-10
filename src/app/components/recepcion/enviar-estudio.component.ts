import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VentaConceptosService } from '../../services/venta-conceptos.service';
import { VentaConceptos } from '../../models/venta-conceptos';

@Component({
  selector: 'app-enviar-estudio',
  templateUrl: './enviar-estudio.component.html',
  styleUrls: ['./enviar-estudio.component.css']
})
export class EnviarEstudioComponent implements OnInit {

  titulo: string = '';
  estudio: VentaConceptos;

  constructor(private route: ActivatedRoute,
    private service: VentaConceptosService) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idPacs: string = params.get('idPacs');
      if (idPacs) {
        this.service.buscarPorIdPacs(idPacs).subscribe(estudio => {
          this.estudio = estudio;
          this.titulo = `${this.estudio.institucion.nombre}: ${this.estudio.concepto.concepto} de ${this.estudio.paciente.nombreCompleto}`;
        });
      }
    });
  }

  

}
