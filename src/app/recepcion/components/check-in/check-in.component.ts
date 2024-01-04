import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { PacientesService } from 'src/app/services/pacientes.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { PacienteOrdenesComponent } from './paciente-ordenes/paciente-ordenes.component';
import { Paciente } from 'src/app/models/paciente';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { catchError, debounceTime, distinctUntilChanged, map, mergeMap, switchMap } from 'rxjs';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { QrSubirFotoOrdenModalComponent } from '../qr-subir-foto-orden-modal/qr-subir-foto-orden-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css'],
})
export class CheckInComponent implements OnInit {
  constructor(
    private ventaConceptosService:VentaConceptosService,
    private ordenVentaService:OrdenVentaService,
    private pacienteService:PacientesService, 
    private dialog:MatDialog,
    ) {}
    botonDeshabilitado:boolean=false;
  autocompleteControlPaciente = new UntypedFormControl('');      
  pacientesFiltrados: Paciente[] = [];
  paciente:Paciente;
  orden: OrdenVenta = null;
  buscarPorPaciente: boolean = false;
  listaDeEstudios:VentaConceptos[] = [];

  @ViewChild('qr') textoQr: ElementRef;
  private searchTimer: any;

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
  
  abrirModalPacienteOrdenes() {
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

  buscarQr(){

     // Limpiar el temporizador existente si existe
     if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    // Establecer un nuevo temporizador para ejecutar la búsqueda después de un retraso de 1000 ms (1 segundo)
    this.searchTimer = setTimeout(() => {
      this.realizarBusqueda();
    }, 1000);
  }

  private realizarBusqueda(){
    const cuerpoCodigo: string = this.textoQr.nativeElement.value;
    console.log(cuerpoCodigo);
    if(cuerpoCodigo == ''){
      return;
    }

    const ids = cuerpoCodigo.split(",");
    if(ids.length != 2){
      return;
    }
    const pacienteId = +ids[0];
    const ordenId = +ids[1];

    this.cargarOrdenVenta(ordenId, pacienteId);
  }
  
  pagar():void{

    this.botonDeshabilitado=true;
    setTimeout(()=>{
      this.ordenVentaService.pagar(this.orden.id).subscribe(
        () =>{
          Swal.fire("Éxito", "Se ha procesado la orden", "success");
          this.reiniciar();
        }, 
        (error) =>{
          Swal.fire("Error", "Ha ocurrido un error", "error");
          console.log(error);
          this.reiniciar();
        }
      );
      this.botonDeshabilitado=true;
    },2000);
    
  }

  cerrar():void{
    this.orden=null;
  }

  mostrarQrSubirFoto(){
    const modalRef = this.dialog.open(QrSubirFotoOrdenModalComponent,
      {
        width: "1000px",
        data: {orden:this.orden}
      });
      modalRef.afterClosed().subscribe();
  }

  
  parseHora(horaString: string): Date {
    if(!horaString){
      return null;
    }
    const [horas, minutos, segundos] = horaString.split(':');
    const fecha = new Date();
    fecha.setHours(parseInt(horas, 10));
    fecha.setMinutes(parseInt(minutos, 10));
    fecha.setSeconds(parseInt(segundos, 10));
    return fecha;
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


  private reiniciar(): void {
    this.buscarPorPaciente = false;
    this.orden = null;
    this.paciente = null;
    this.listaDeEstudios = [];
    this.textoQr.nativeElement.value = '';
  }
}
