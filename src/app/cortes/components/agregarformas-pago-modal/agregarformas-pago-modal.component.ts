import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agregarformas-pago-modal',
  templateUrl: './agregarformas-pago-modal.component.html',
  styleUrls: ['./agregarformas-pago-modal.component.css'],
})
export class AgregarformasPagoModalComponent implements OnInit {
  ngOnInit(): void {
    this.algo();
  }

  algo = (): void => {
    console.log('algo');
  };
}
