import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VentaConceptosService } from '../../services/venta-conceptos.service';
import { VentaConceptos } from '../../models/venta-conceptos';
import { InterpretacionService } from '../../services/interpretacion.service';
import { Interpretacion } from '../../models/interpretacion';
import { BASE_ENDPOINT } from 'src/app/config/app';

@Component({
  selector: 'app-dictamen',
  templateUrl: './dictamen.component.html',
  styleUrls: ['./dictamen.component.css']
})
export class DictamenComponent implements OnInit {

  estudio: VentaConceptos;
  titulo: string = '';
  interpretacion: Interpretacion;
  enlacePdf: String;

  constructor(private route: ActivatedRoute,
    private service: VentaConceptosService,
    private interpretacionService: InterpretacionService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idPacs: string = params.get('idPacs');
      if (idPacs) {
        this.service.buscarPorIdPacs(idPacs).subscribe(estudio => {
          this.estudio = estudio;
          this.titulo = `${this.estudio.institucion.nombre}: ${this.estudio.concepto.concepto} de ${this.estudio.paciente.nombreCompleto}`;
          this.cargarInterpretacion();
          this.enlacePdf = `${BASE_ENDPOINT}/ris/interpretaciones/estudio/${estudio.id}/pdf`;
        });
      }
    });
  }

  cargarInterpretacion(): void{
    this.interpretacionService.encontrarPorEstudioId(this.estudio.id).subscribe(interpretacion => {
      this.interpretacion = interpretacion[0];
    });
  }

  descargarPdf(): void{
    window.open(`${BASE_ENDPOINT}/ris/interpretaciones/estudio/${this.estudio.id}/pdf`);
  }

}
