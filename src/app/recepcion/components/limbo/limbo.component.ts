import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { algo } from 'crypto-js';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { Cita } from 'src/app/models/cita';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { AreasService } from 'src/app/services/areas.service';
import { CitaService } from 'src/app/services/cita.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { FechaService } from 'src/app/services/fecha.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-limbo',
  templateUrl: './limbo.component.html',
  styleUrls: ['./limbo.component.css'],
})
export class LimboComponent implements OnInit {
  autocompleteControl: FormControl = new FormControl();
  equiposDicom: EquipoDicom[] = [];
  area: Area = null;
  equipoDicom: EquipoDicom;
  areasFiltradas: [] = [];
  autocompleteControlArea = new UntypedFormControl();
  fecha: string;
  minDate: Date;
  date: FormControl = new FormControl(null);
  estudiosEnElLimbo: Cita[] = null;

  constructor(
    private fechaService: FechaService,
    private equipoDicomService: EquipoDicomService,
    private areaService: AreasService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    this.autocompleteControlArea.valueChanges
      .pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        mergeMap((valor) =>
          valor ? this.areaService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((areas) => {
        this.areasFiltradas = areas;
      });
  }

  mostrarNombre(sala?): string {
    return sala ? sala.nombre : '';
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent) {
    this.area = event.option.value as Area;
    event.option.deselect();
    event.option.focus();
    this.cargarEquiposDicom();
  }

  public actualizarFecha(fecha: HTMLInputElement) {
    this.fecha = this.fechaService.alistarFechaParaBackend(fecha.value);
    this.buscarEstudiosEnElLimbio(this.equipoDicom.id, this.fecha);
  }

  buscarEstudiosEnElLimbio(idSala: number, fecha: string): void {
    this.citaService.obtenerCitasDelLimbo(idSala, fecha).subscribe(
      (fechas) => {
        console.log(fechas);
        this.estudiosEnElLimbo = fechas;
      },
      (error) => {
        this.estudiosEnElLimbo = null;
      }
    );
  }

  liberarEstudioDelLimbo(idCita: number): void {
    Swal.fire({
      icon: 'question',
      title: 'Seguro que quieres liberar la hora?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver',
      confirmButtonText: 'Si, liberar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.salvameDelHastio(idCita).subscribe((algo) => {
          console.log(algo);
        });
        this.estudiosEnElLimbo = this.estudiosEnElLimbo.filter(
          (cita) => cita.id !== idCita
        );
        Swal.fire({
          title: 'Liberado',
          text: 'Ahora el espacio esta disponible',
          icon: 'success',
        });
      }
      return;
    });
  }
  private cargarEquiposDicom(): void {
    this.equipoDicomService
      .filtrarPorArea(this.area.id)
      .subscribe((equipos) => {
        this.equiposDicom = equipos;
      });
  }
}
