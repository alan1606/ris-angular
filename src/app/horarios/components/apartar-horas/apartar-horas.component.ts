import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { Router } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { AreasService } from 'src/app/services/areas.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { FechaService } from 'src/app/services/fecha.service';
import { HorarioService } from 'src/app/services/horario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apartar-horas',
  templateUrl: './apartar-horas.component.html',
  styleUrls: ['./apartar-horas.component.css']
})
export class ApartarHorasComponent {
  autocompleteControlArea = new FormControl();
  areasFiltradas: Area[] = [];
  salas: EquipoDicom[] = [];
  formulario: FormGroup;
  sala: EquipoDicom = null;
  fechaInicio: string;
  fechaFin: string;
  aplicarATodo = true;
  horaInicio:string = "";
  horaFin:string = "";

  constructor(
    private fb: FormBuilder,
    private areasService: AreasService,
    private equiposDicomService: EquipoDicomService,
    private horariosService: HorarioService,
    private fechaService: FechaService,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      salaControl: new FormControl('')
    });
    this.fechaInicio = "";
    this.fechaFin = "";
  }

  ngOnInit(): void {

    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areasService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => this.areasFiltradas = areas);

    this.formulario.get('salaControl').valueChanges.subscribe(value => {
      if(!value) {
        return;
      }
      this.equiposDicomService.ver(value).subscribe(sala => this.sala = sala,
        err => console.log(err));
    });
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent): void {
    const area = event.option.value as Area;

    event.option.deselect();
    event.option.focus();

    this.cargarEquiposDicomDeAreaSeleccionada(area.id);
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  cargarEquiposDicomDeAreaSeleccionada(areaId: number): void {
    this.equiposDicomService.filtrarPorArea(areaId).subscribe(salas => this.salas = salas);
  }



  seleccionarFechas(fechaInicio: HTMLInputElement, fechaFin: HTMLInputElement): void {
    if (fechaInicio.value == '' || fechaFin.value == '') {
      this.fechaInicio = '';
      this.fechaFin = '';
      return;
    }

    this.fechaInicio = this.fechaService.alistarFechaParaBackend(fechaInicio.value);
    this.fechaFin = this.fechaService.alistarFechaParaBackend(fechaFin.value);

    console.log(this.fechaInicio + " " + this.fechaFin)
  }

  apartarCitas(){
    if(!this.datosValidos()){
      Swal.fire("Error", "Llene correctamente los datos", "error");
      return;
    }
    if(this.aplicarATodo){
      this.apartarTodasCitas(this.fechaInicio, this.fechaFin, this.horaInicio, this.horaFin);
      return;
    }
    this.apartarCitasPorSala(this.fechaInicio, this.fechaFin, this.sala, this.horaInicio, this.horaFin);
  }

  private datosValidos(): boolean {
    if(this.fechaInicio == '' || this.fechaFin == ''){
      return false;
    }
    if(this.horaInicio == '' || this.horaFin == ''){
      return false;
    }
    if(!this.aplicarATodo && this.sala == null){  
      return false;
    }
    return true;
  }


  private apartarCitasPorSala(fechaInicio: string, fechaFin: string, sala: EquipoDicom, horaInicio: string, horaFin: string) {
    this.horariosService.marcarDiaInhabilEnSalaHoras(fechaInicio, fechaFin, sala.id, horaInicio, horaFin).subscribe(
      () => { Swal.fire("Éxito", "Operación realizada exitosamente", "success")},
      () => { Swal.fire("Error", "Ha ocurrido un error", "error")}
    );
    this.limpiarCampos();
  }
  
  private apartarTodasCitas(fechaInicio: string, fechaFin: string, horaInicio: string, horaFin: string) {
    this.horariosService.marcarDiaInhabilHoras(fechaInicio, fechaFin, horaInicio, horaFin).subscribe(
      () => { Swal.fire("Éxito", "Operación realizada exitosamente", "success")},
      () => { Swal.fire("Error", "Ha ocurrido un error", "error")}
    );
    this.volver();
  }

  private limpiarCampos(): void {
    this.sala = null;
    this.formulario.get("salaControl").setValue('');
  }

  private volver(): void{
    this.router.navigate(['/horarios']);
  }
}
