import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Cita } from 'src/app/models/cita';

@Component({
  selector: 'app-buscador-areas',
  templateUrl: './buscador-areas.component.html',
  styleUrls: ['./buscador-areas.component.css'],
})
export class BuscadorAreasComponent implements OnInit {
  @Input() citas: Cita[] = [];
  @Output() citasFiltradasEmit = new EventEmitter<Cita[]>();

  busqueda: string = '';
  citasFiltradas: Cita[] = [];
  total: number = 0;
  ngOnInit(): void {
    
  }
  filtrarAreas() {
    this.citasFiltradas = !this.busqueda
      ? this.citas
      : this.citas.filter((cita) =>
          cita.estudio.concepto.area.nombre.includes(
            this.busqueda.toUpperCase()
          )
        );
    this.total = this.citasFiltradas.length;
      console.log(this.citasFiltradas)
      this.citasFiltradasEmit.emit(this.citasFiltradas);
  }
}
