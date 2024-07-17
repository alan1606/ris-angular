import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormLimitarInstitucionPorSalaComponent } from '../form-limitar-institucion-por-sala/form-limitar-institucion-por-sala.component';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { FormControl, FormGroup } from '@angular/forms';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { AreasService } from 'src/app/services/areas.service';
import { Area } from 'src/app/models/area';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, mergeMap } from 'rxjs';
import { LimitarInstitucionPorSalaService } from '../../services/limitar-institucion-por-sala.service';
import { LimiteInstitucionSala } from 'src/app/models/LimiteInstitucionSala';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { Institucion } from 'src/app/models/institucion';
@Component({
  selector: 'app-limitar-institucion-por-sala',
  templateUrl: './limitar-institucion-por-sala.component.html',
  styleUrl: './limitar-institucion-por-sala.component.css',
})
export class LimitarInstitucionPorSalaComponent implements OnInit {
  equipoDicomService = inject(EquipoDicomService);
  areaService = inject(AreasService);
  institucionService = inject(InstitucionService);
  dialog = inject(MatDialog);
  alertaService = inject(AlertaService);
  limitarInstitucionPorSalaService = inject(LimitarInstitucionPorSalaService);

  formulario: FormGroup = new FormGroup({
    areaControl: new FormControl(),
    salaControl: new FormControl(),
    institucionControl: new FormControl(),
  });

  areasFiltradas: Area[] = [];
  area: Area;

  equiposDicom: EquipoDicom[] = [];
  equipoDicom: EquipoDicom;

  instituciones: Institucion[];
  institucion: Institucion;

  displayedColumns: string[] = [
    'Institucion',
    'Limite diario',
    'Activo',
    'Cambiar',
  ];
  dataSource: LimiteInstitucionSala[] = [];

  ngOnInit(): void {
    this.formulario
      .get('areaControl')
      .valueChanges.pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        mergeMap((valor) =>
          valor ? this.areaService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((areas) => {
        this.areasFiltradas = areas;
      });

    this.formulario.get('salaControl').valueChanges.subscribe((value) => {
      this.equipoDicomService.ver(value).subscribe(
        (sala) => {
          this.equipoDicom = sala;
          this.salaSeleccionada();
        },
        (err) => console.log(err)
      );
    });

    this.formulario
      .get('institucionControl')
      .valueChanges.pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        mergeMap((valor) =>
          valor ? this.institucionService.buscarLikeNombre(valor) : []
        )
      )
      .subscribe((institucion) => {
        this.instituciones = institucion;
      });
  }

  anadirLimite(): void {
    const modalRef = this.dialog.open(FormLimitarInstitucionPorSalaComponent, {
      width: '1000px',
      disableClose: true,
    });
    modalRef.afterClosed().subscribe((data) => {
      if (data) {
        this.dataSource.push(data);
      }
    });
  }

  editarLimite(limite: LimiteInstitucionSala): void {
    const modalRef = this.dialog.open(FormLimitarInstitucionPorSalaComponent, {
      data: limite,
      width: '1000px',
      disableClose: true,
    });
    modalRef.afterClosed().subscribe((data: LimiteInstitucionSala) => {
      if (data) {
        this.dataSource = this.dataSource.filter(
          (limite) => limite.id !== data.id
        );
        this.dataSource.push(data);
      }
    });
  }

  public eliminarLimite(limiteId: number): void {
    this.limitarInstitucionPorSalaService
      .eliminarLimitePorId(limiteId)
      .subscribe(
        (data) => {
          console.log(data);
          this.alertaService.exito('Eliminado');
          this.dataSource = this.dataSource.filter(
            (limite) => limite.id !== limiteId
          );
        },
        (error) => {
          this.alertaService.error(error);
        }
      );
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
  mostrarNombreInstitucion(institucion: Institucion): string {
    return institucion ? institucion.nombre : '';
  }

  seleccionarInstitucion(event: MatAutocompleteSelectedEvent) {
    this.institucion = event.option.value as Institucion;
    event.option.deselect();
    event.option.focus();
    this.buscarPorSalaInstitucion();
  }
  salaSeleccionada(): void {
    console.log(this.equipoDicom);
    this.limitarInstitucionPorSalaService
      .encontrarLimitesPorSala(this.equipoDicom.id)
      .subscribe(
        (data) => {
          console.log(data);
          this.dataSource = data;
        },
        (error) => {
          this.alertaService.error(error);
        }
      );
  }

  private cargarEquiposDicom(): void {
    this.equipoDicomService
      .filtrarPorArea(this.area.id)
      .subscribe((equipos) => {
        this.equiposDicom = equipos;
      });
  }

  private buscarPorSalaInstitucion(): void {
    this.limitarInstitucionPorSalaService
      .encontrarLimitesPorSalaInstitucion(
        this.equipoDicom.id,
        this.institucion.id
      )
      .subscribe(
        (limite) => {
          console.log(limite);
          this.dataSource = [];
          this.dataSource.push(limite);
        },
        (error) => this.alertaService.error(error)
      );
  }
}
