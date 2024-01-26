import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { QrSubirFotoOrdenModalComponent } from '../qr-subir-foto-orden-modal/qr-subir-foto-orden-modal.component';
import Swal from 'sweetalert2';
import { Cita } from 'src/app/models/cita';
import { CitaService } from 'src/app/services/cita.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css'],
})
export class CheckInComponent implements OnInit {
  constructor(
    private ventaConceptosService:VentaConceptosService,
    private ordenVentaService:OrdenVentaService,
    private dialog:MatDialog,
    private citaService: CitaService
    ) {}
  botonHabilitado:boolean=false;
  autocompleteControlPaciente = new UntypedFormControl('');      
  orden: OrdenVenta = null;
  listaDeEstudios:VentaConceptos[] = [];
  guardarPresionado:boolean = false;
  citas: Cita[] = [];

  @ViewChild('qr') textoQr: ElementRef;
  private searchTimer: any;

  ngOnInit(): void {
    this.citaService.citasDeHoy().subscribe(
      citas => {
        this.citas = citas;
      },
      error => {
        console.log(error);
      }
    );
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
    setTimeout(()=>{
      this.botonHabilitado=true;
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

  presionadoBotonGuardar(presionado){
    this.guardarPresionado = presionado as boolean;
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

  seleccionar(cita: Cita): void {
    this.ventaConceptosService.ver(cita.ventaConceptoId).subscribe(
      estudio => {
        this.cargarOrdenVenta(estudio.ordenVenta.id, estudio.paciente.id);
      }, 
      error => {
        console.log(error);
      }
    );
  }

  private cargarOrdenVenta(ordenId: number, pacienteId: number): void{
    this.ordenVentaService.ver(ordenId).subscribe(
      orden => {
        if(orden.paciente.id === pacienteId){
          this.orden = orden;
          Swal.fire("Guardar paciente", "Presione guardar paciente para poder pagar", "info");
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
    this.orden = null;
    this.listaDeEstudios = [];
    this.guardarPresionado = false;
    this.botonHabilitado = false;

  }
}
