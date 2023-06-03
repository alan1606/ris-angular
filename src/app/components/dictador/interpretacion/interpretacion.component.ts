import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-interpretacion',
  templateUrl: './interpretacion.component.html',
  styleUrls: ['./interpretacion.component.css']
})
export class InterpretacionComponent implements OnInit {

  @Input() interpretacion: string;

  @ViewChild('interpretacion', { static: false }) interpretacionHtml: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.interpretacion) {
      console.log(this.interpretacion);
      this.interpretacionHtml.nativeElement.innerHTML = this.interpretacion;
    }
  }


  public convertToPDF()
  {
      html2canvas(document.getElementById("reporte")).then(canvas => {
        // Few necessary setting options
        const contentDataURL = canvas.toDataURL('image/png')
        let pdf = new jsPDF('p', 'mm', 'letter'); 
        var width = pdf.internal.pageSize.getWidth();
        var height = canvas.height * width / canvas.width;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)
        pdf.save('output.pdf'); // Generated PDF
      });
  }

}
