import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { Horario } from 'src/app/models/horario';
import { AreasService } from 'src/app/services/areas.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { HorarioService } from 'src/app/services/horario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-horario-form',
  templateUrl: './horario-form.component.html',
  styleUrls: ['./horario-form.component.css']
})
export class HorarioFormComponent implements OnInit {

  autocompleteControlArea = new FormControl();
  areasFiltradas: Area[] = [];
  salas: EquipoDicom[] = [];

  horario: Horario;
  dias: string[] = [
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO'
  ];


  constructor(
    private areasService: AreasService,
    private equiposDicomService: EquipoDicomService,
    private horariosService: HorarioService,
    private  route: ActivatedRoute,
    private router: Router
    ) {
    this.horario = new Horario();
   }

  ngOnInit(): void {
    this.autocompleteControlArea.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      mergeMap(valor => valor ? this.areasService.filtrarPorNombre(valor) : [])
    ).subscribe(areas => this.areasFiltradas = areas);

    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.horariosService.ver(id).subscribe(horario =>
          {
            this.horario = horario;
            this.equiposDicomService.ver(this.horario.salaId).subscribe(sala => {
              this.salas.push(sala);
              this.autocompleteControlArea.setValue(sala.area);
            });
          },() => {

          });
      }
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

  cargarEquiposDicomDeAreaSeleccionada(areaId: number): void{
    this.equiposDicomService.filtrarPorArea(areaId).subscribe(salas => this.salas = salas);
  }

  editar(){
    if(this.datosValidos()){
      this.editarHorario();
    }
    else{
      Swal.fire("Revise los campos", "Asegúrese de llenar correctamente los datos", "error");
    }
  }

  crear(){
    if(this.datosValidos()){
      this.registrarHorario();
    }
    else{
      Swal.fire("Revise los campos", "Asegúrese de llenar correctamente los datos", "error");
    }
  }


  datosValidos(): boolean{
    console.log(this.horario.duracionMinutos);

    if(!this.horario?.salaId){
      return false;
    }
    if(!this.horario?.dia){
      return false;
    }
    if(!this.horario?.duracionMinutos){
      return false;
    }
    if(!this.horario?.horaInicio){
      return false;
    }
    if(!this.horario?.horaFin){
      return false;
    }
    return true;
  }

  registrarHorario(): void{
    this.horariosService.crear(this.horario).subscribe(
      ()  => {
        Swal.fire("Registrado", "El horario ha sido registrado", "success");
      },
      error => {
        Swal.fire("Error", "Error", "error");
        console.log(error);
      }
    );
  }

  editarHorario(): void{
    this.horariosService.editar(this.horario).subscribe(modificado => {
      Swal.fire("Modificado", "El horario se ha modificado satisfactoriamente", "success");
      this.router.navigate(['horarios']);
    }, error => {
      Swal.fire("Error", "Ha ocurrido un error al modificar el horario", "error");
      console.log(error);
    });
  }

}
