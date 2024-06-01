import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-campo-fecha',
  templateUrl: './campo-fecha.component.html',
  styleUrls: ['./campo-fecha.component.css'],
})
export class CampoFechaComponent {
  @Input() public label: string;
}
