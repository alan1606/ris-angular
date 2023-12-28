import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cita } from 'src/app/models/cita';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { CitaService } from 'src/app/services/cita.service';
import { FechaService } from 'src/app/services/fecha.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reagendar-cita-modal',
  templateUrl: './reagendar-cita-modal.component.html',
  styleUrls: ['./reagendar-cita-modal.component.css']
})
export class ReagendarCitaModalComponent implements OnInit {

  titulo: string = "";
  cita: Cita;
  fecha: string;
  equipoDicom: EquipoDicom;
  citas: Cita[] = [];
  minDate: Date;
  formulario: FormGroup;
  estudio: VentaConceptos;
  nuevaCita: Cita;

  constructor(
    public dialogRef: MatDialogRef<ReagendarCitaModalComponent>,
    private fechaService: FechaService,
    private citaService: CitaService,
    private pipe: DatePipe,
    private fb: FormBuilder,
    private ventaConceptosService: VentaConceptosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formulario = this.fb.group({
      citaControl: new FormControl('')
    });
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.cita = this.data.cita as Cita;

    this.ventaConceptosService.ver(this.cita.estudio.id).subscribe(
      venta => {
        this.equipoDicom = venta.equipoDicom;
        this.estudio = venta;
      }
    );

    const { paciente, cita, concepto } = this.cita.estudio;
    this.titulo = `Reagendar ${concepto.area.nombre} ${concepto.concepto} de ${paciente.nombreCompleto}`;
    console.log(cita);
    this.fecha = this.pipe.transform(new Date(), 'yyyy-MM-dd');

    this.formulario.get('citaControl').valueChanges.subscribe(value => {
      if (value) {
        this.nuevaCita = value;
        this.reagendar(this.nuevaCita);
      }

    });
  }

  public actualizarFecha(fecha: HTMLInputElement) {
    this.fecha = this.fechaService.alistarFechaParaBackend(fecha.value);

    this.citaService.obtenerDisponiblesPorSalaYFecha(this.equipoDicom.id, this.fecha).subscribe(citas => {
      this.citas = citas;
    },
      error => {
        Swal.fire("No hay citas", error.error.detail, "info");
        this.citas = [];
        this.cita = null;
        console.log(error);
      });
  };


  private reagendar(nuevaCita: Cita) {
    if (!this.datosValidos()) {
      return;
    }

    this.dialogRef.close(nuevaCita.id);
  }

  datosValidos(): boolean {
    if (this.cita == null) {
      return false;
    }
    if (this.equipoDicom == null) {
      return false;
    }
    return true;
  }

}
