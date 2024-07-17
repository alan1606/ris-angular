import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, mergeMap } from 'rxjs';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { Institucion } from 'src/app/models/institucion';
import { AreasService } from 'src/app/services/areas.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { LimitarInstitucionPorSalaService } from '../../services/limitar-institucion-por-sala.service';
import { LimiteInstitucionSala } from 'src/app/models/LimiteInstitucionSala';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-form-limitar-institucion-por-sala',
  templateUrl: './form-limitar-institucion-por-sala.component.html',
  styleUrl: './form-limitar-institucion-por-sala.component.css',
})
export class FormLimitarInstitucionPorSalaComponent implements OnInit {
  equipoDicomService = inject(EquipoDicomService);
  areaService = inject(AreasService);
  institucionService = inject(InstitucionService);
  dialogRef = inject(MatDialogRef<FormLimitarInstitucionPorSalaComponent>);
  limiteInsitucionPorSalaService = inject(LimitarInstitucionPorSalaService);
  alertaService = inject(AlertaService);
  formulario: FormGroup = new FormGroup({
    areaControl: new FormControl(),
    salaControl: new FormControl(),
    institucionControl: new FormControl(),
  });
  areasFiltradas = signal<Area[]>([]);
  area = signal<Area>(new Area());
  equiposDicom = signal<EquipoDicom[]>([]);
  equipoDicom = signal<EquipoDicom>(null);
  instituciones = signal<Institucion[]>([]);
  institucion = signal<Institucion>(null);
  limiteDiario =signal<number>(0);
  activo: boolean = false; //nomas a este no le pude poner signal

  constructor(@Inject(MAT_DIALOG_DATA) public limite?: LimiteInstitucionSala) {}

  ngOnInit(): void {
    if (this.limite) {
      this.formulario.get('areaControl').setValue(this.limite?.sala.area);
      this.formulario.get('salaControl').setValue(this.limite?.sala);
      this.formulario
        .get('institucionControl')
        .setValue(this.limite?.institucion);
      this.activo = this.limite?.activo;
      this.limiteDiario.set(this.limite?.limiteDiario);
      console.log(this.activo);
    }
    this.formulario
      .get('areaControl')
      .valueChanges.pipe(
        map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
        mergeMap((valor) =>
          valor ? this.areaService.filtrarPorNombre(valor) : []
        )
      )
      .subscribe((areas) => {
        this.areasFiltradas.set(areas);
      });

    this.formulario.get('salaControl').valueChanges.subscribe((value) => {
      this.equipoDicomService.ver(value).subscribe(
        (sala) => {
          this.equipoDicom.set(sala);
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
        this.instituciones.set(institucion);
      });
  }

  mostrarNombreArea(area?: Area): string {
    return area ? area.nombre : '';
  }

  seleccionarArea(event: MatAutocompleteSelectedEvent) {
    this.area.set(event.option.value);
    event.option.deselect();
    event.option.focus();
    this.cargarEquiposDicom();
  }
  mostrarNombreInstitucion(institucion: Institucion): string {
    return institucion ? institucion.nombre : '';
  }

  seleccionarInstitucion(event: MatAutocompleteSelectedEvent) {
    this.institucion.set(event.option.value);
    event.option.deselect();
    event.option.focus();
  }

  private cargarEquiposDicom(): void {
    this.equipoDicomService
      .filtrarPorArea(this.area().id)
      .subscribe((equipos) => {
        this.equiposDicom.set(equipos);
      });
  }
  public salir(): void {
    this.dialogRef.close();
  }

  public guardar(): void {
    console.log(this.activo);
    let limite: LimiteInstitucionSala = new LimiteInstitucionSala();
    limite.sala = this.equipoDicom();
    limite.activo = this.activo;
    limite.limiteDiario = this.limiteDiario();
    limite.institucion = this.institucion();

    if (this.limite?.id) {
      this.limiteInsitucionPorSalaService
        .actualizarLimite(this.limite.id, limite)
        .subscribe(
          (data) => {
            console.log(data);
            this.alertaService.exito('Listo', 'Limite actualizado');
            this.dialogRef.close(data);
          },
          (error) => {
            this.alertaService.error(error);
          }
        );
      return;
    }
    this.limiteInsitucionPorSalaService.crearLimite(limite).subscribe(
      (data) => {
        this.alertaService.exito('Listo', 'Limite creado');
        this.dialogRef.close(data);
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
    return;
  }
}
