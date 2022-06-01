import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RESULTS_URL } from 'src/app/config/app';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent implements OnInit {

  estudio: VentaConceptos;
  ruta: string = "";

  constructor(private route: ActivatedRoute,
    private service: VentaConceptosService 
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idPacs: string = params.get('idPacs');
      if (idPacs) {
        this.service.buscarPorIdPacs(idPacs).subscribe(estudio => {
          this.estudio = estudio;
          this.ruta = RESULTS_URL + estudio.idPacs;
        });
      }
    });
  }

  public exportHtmlToPDF(){
    let data = document.getElementById('imprimir');
      
      html2canvas(data).then(canvas => {
          
          let docWidth = 208;
          let docHeight = canvas.height * docWidth / canvas.width;
          
          const contentDataURL = canvas.toDataURL('image/png')
          let doc = new jsPDF('l', 'mm', [28, 90]);
          let position = 0;
          doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight)
          
          doc.save('exportedPdf.pdf');
      });
  }

}
