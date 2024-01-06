import { Component, OnInit } from '@angular/core';
import { SubirFotoOrdenComponent } from '../subir-foto-orden/subir-foto-orden.component';
import { Paciente } from 'src/app/models/paciente';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UntypedFormControl } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PacientesService } from 'src/app/services/pacientes.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { PacienteOrdenesComponent } from '../check-in/paciente-ordenes/paciente-ordenes.component';
import { MatDialog } from '@angular/material/dialog';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { Study } from 'src/app/models/study';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { QrSubirFotoOrdenModalComponent } from '../qr-subir-foto-orden-modal/qr-subir-foto-orden-modal.component';
@Component({
  selector: 'app-buscar-paciente-subir-foto-orden',
  templateUrl: './buscar-paciente-subir-foto-orden.component.html',
  styleUrls: ['./buscar-paciente-subir-foto-orden.component.css']
})
export class BuscarPacienteSubirFotoOrdenComponent implements OnInit {

  constructor(
    private pacienteService:PacientesService,
    private dialog:MatDialog,
    private ordenVentaService:OrdenVentaService,
    private ventaConceptosService:VentaConceptosService
  ) { }

  autocompleteControlPaciente = new UntypedFormControl('');   
  pacientesFiltrados:Paciente[]=[];
  listaDeEstudios:VentaConceptos[]=[];
  paciente:Paciente=null;
  orden:OrdenVenta=null;

  ngOnInit(): void {
    this.autocompleteControlPaciente.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap(valor => {
        const nombreCompleto = typeof valor === 'string' ? valor : valor.nombreCompleto;
        return valor ? this.pacienteService.filtrarPorNombre(nombreCompleto) : [];
      }),
      catchError(error => {
        console.error('Error en la búsqueda de pacientes:', error);
        return [];
      })
    ).subscribe(pacientes => {
      this.pacientesFiltrados = pacientes;
    });
  }

  mostrarNombrePaciente(paciente: Paciente): string {
    return paciente && paciente.nombre ? paciente.nombreCompleto : '';
  }

  seleccionarPaciente(event: MatAutocompleteSelectedEvent): void {
    this.paciente = event.option.value as Paciente;
    event.option.deselect();
    event.option.focus();
  }

  abrirModalPacienteOrdenes(){
    const modalRef = this.dialog.open(PacienteOrdenesComponent,
      {
        width: "1000px",
        data: {paciente:this.paciente?.id ? this.paciente : null  }
      });
      modalRef.afterClosed().subscribe(orden => {
        if(orden && orden?.id){
          this.orden = orden;
          this.cargarOrdenVenta(this.orden.id, this.orden.paciente.id);
        }
      });
  }
  private cargarOrdenVenta(ordenId: number, pacienteId: number): void{
    this.ordenVentaService.ver(ordenId).subscribe(
      orden => {
        if(orden.paciente.id === pacienteId){
          this.orden = orden;
          this.ventaConceptosService.encontrarPorOrdenVentaId(orden.id).subscribe(
              estudios => {
                this.listaDeEstudios = estudios;
              },
              error => console.log(error)
          );
        }
        else{
          this.orden = null;
        }
      },
      error => {
        console.log(error);
        this.orden = null;
      }
    );    
  }

  mostrarQrSubirFoto(){
    const modalRef = this.dialog.open(QrSubirFotoOrdenModalComponent,
      {
        width: "1000px",
        data: {orden:this.orden}
      });
      modalRef.afterClosed().subscribe();
  }

}
