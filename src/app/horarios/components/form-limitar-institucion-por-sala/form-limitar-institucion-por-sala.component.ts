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
import Swal from 'sweetalert2';

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
  equipoDicom = signal<EquipoDicom>(new EquipoDicom());
  instituciones = signal<Institucion[]>([]);
  institucion = signal<Institucion>(new Institucion());
  limiteDiario = signal<number>(0);
  activo: boolean = false; //nomas a este no le pude poner signal

  constructor(@Inject(MAT_DIALOG_DATA) public limite?: any) {}

  ngOnInit(): void {
    //Estos primeros dos if permite poner datos en caso de que se edite un limite, el primer if entra en accion para escribir los datos
    //en caso de que se tengan filtros en la busqueda el segundo if entra en accion y escribe los datos de la busqueda para agilizar el proceso de creacion
    if (this.limite.id) {
      this.formulario.get('areaControl').setValue(this.limite?.sala.area);
      this.area.set(this.limite?.sala.area);
      this.cargarEquiposDicom()
      this.formulario.get('salaControl').setValue(this.limite?.sala?.id);
      this.equipoDicom.set(this.limite?.sala);
      this.formulario
        .get('institucionControl')
        .setValue(this.limite?.institucion);
      this.institucion.set(this.limite?.institucion);
      this.activo = this.limite?.activo;
      this.limiteDiario.set(this.limite?.limiteDiario);
    }
    if(this.limite.area){
      this.formulario.get('areaControl').setValue(this.limite?.area);
      this.area.set(this.limite?.area);
      this.cargarEquiposDicom()
      this.formulario.get('salaControl').setValue(this.limite?.sala?.id);
      this.equipoDicom.set(this.limite?.sala);
      this.formulario
        .get('institucionControl')
        .setValue(this.limite?.institucion);
      this.institucion.set(this.limite?.institucion);
    }

    //autocompletes de los inputs de area, sala e institucion
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
    if (!this.camposValidos()) {
      return;
    }
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

  private camposValidos(): boolean {
    if (!this.area().id) {
      Swal.fire({
        icon: 'info',
        toast: true,
        title: 'Porfavor',
        text: 'seleccione un área.',
      });
      return false;
    }
    if (!this.equipoDicom().id) {
      Swal.fire({
        icon: 'info',
        toast: true,
        title: 'Porfavor',
        text: 'seleccione una sala.',
      });
      return false;
    }

    if (!this.institucion().id) {
      Swal.fire({
        icon: 'info',
        toast: true,
        title: 'Porfavor',
        text: 'seleccione una institución.',
      });
      return false;
    }
    if (this.limiteDiario() === 0 || !this.limiteDiario()) {
      Swal.fire({
        icon: 'info',
        toast: true,
        title: 'Porfavor',
        text: 'establezca un limite.',
      });
      return false;
    }
    return true;
  }
}
