import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Institucion } from 'src/app/models/institucion';
import { InstitucionService } from 'src/app/services/institucion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seleccionar-institucion',
  templateUrl: './seleccionar-institucion.component.html',
  styleUrls: ['./seleccionar-institucion.component.css'],
})
export class SeleccionarInstitucionComponent implements OnInit {
  autocompleteInstitucionControl: FormControl = new FormControl();
  instituciones: Institucion[] = [];
  institucion: Institucion;

  constructor(
    private institucionService: InstitucionService,
    private dialog: MatDialogRef<SeleccionarInstitucionComponent>
  ) {}

  ngOnInit(): void {
    this.autocompleteInstitucionControl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((valor) => {
          const nombre = typeof valor === 'string' ? valor : valor.nombre;
          return valor ? this.institucionService.buscarLikeNombre(nombre) : [];
        })
      )
      .subscribe((instituciones) => {
        this.instituciones = instituciones;
      });
  }

  mostrarNombreInstitucion(institucion?: Institucion): string {
    return institucion ? institucion.nombre : '';
  }

  seleccionarInstitucion(event: MatAutocompleteSelectedEvent): void {
    this.institucion = event.option.value as Institucion;
  }

  seleccionar(): void {
    if (!this.institucion) {
      return;
    }
    Swal.fire({
      icon: 'question',
      title: '¿Seguro?',
      showCancelButton: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialog.close(this.institucion);
      }
    });
  }
}
