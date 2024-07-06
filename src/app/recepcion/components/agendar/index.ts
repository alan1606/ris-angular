import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
} from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
} from 'rxjs';
import { Campania } from 'src/app/campanias/models/campania';
import { CampaniaService } from 'src/app/campanias/services/campania.service';
import { Area } from 'src/app/models/area';
import { Concepto } from 'src/app/models/concepto';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { Institucion } from 'src/app/models/institucion';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { Paciente } from 'src/app/models/paciente';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AreasService } from 'src/app/services/areas.service';
import { ConceptosService } from 'src/app/services/conceptos.service';
import { EquipoDicomService } from 'src/app/services/equipo-dicom.service';
import { InstitucionService } from 'src/app/services/institucion.service';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { PacientesService } from 'src/app/services/pacientes.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Cita } from 'src/app/models/cita';
import { CitaService } from 'src/app/services/cita.service';
import { RegistrarPacienteParcialModalComponent } from '../registrar-paciente-parcial-modal/registrar-paciente-parcial-modal.component';
import { FechaService } from 'src/app/services/fecha.service';
import { MostrarCitasPorDiaPensionesComponent } from '../mostrar-citas-por-dia-pensiones/mostrar-citas-por-dia-pensiones.component';
import { InstruccionesService } from 'src/app/services/instrucciones.service';
import { DataService } from '../services/data-service.service';
import { Pago } from 'src/app/models/pago';
import { Descuento } from 'src/app/models/descuento';
export {
  Component,
  OnInit,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  MatAutocompleteSelectedEvent,
  MatDialog,
  Campania,
  DataService,
  CampaniaService,
  Area,
  Concepto,
  EquipoDicom,
  Institucion,
  OrdenVenta,
  OrdenVentaService,
  Paciente,
  VentaConceptos,
  AreasService,
  ConceptosService,
  EquipoDicomService,
  InstitucionService,
  PacientesService,
  Swal,
  DatePipe,
  Cita,
  CitaService,
  RegistrarPacienteParcialModalComponent,
  FechaService,
  MostrarCitasPorDiaPensionesComponent,
  InstruccionesService,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
  Pago,
  Descuento
};

