import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';
import { OrdenVentaService } from 'src/app/services/orden-venta.service';
import { OrdenVenta } from 'src/app/models/orden-venta';
import { QrSubirFotoOrdenModalComponent } from '../qr-subir-foto-orden-modal/qr-subir-foto-orden-modal.component';
import Swal from 'sweetalert2';
import { Cita } from 'src/app/models/cita';
import { CitaService } from 'src/app/services/cita.service';
import { CambiarEstudioComponent } from './cambiar-estudio/cambiar-estudio.component';
import { AgregarEstudioComponent } from './agregar-estudio/agregar-estudio.component';
import { CampaniaService } from 'src/app/campanias/services/campania.service';
import { Pago } from 'src/app/models/pago';
import { Descuento } from 'src/app/models/descuento';
import { DataService } from '../services/data-service.service';
import { Subscription, forkJoin, map } from 'rxjs';
import { SeleccionarInstitucionComponent } from 'src/app/instituciones/components/seleccionar-institucion/seleccionar-institucion.component';
import { Institucion } from '../agendar';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css'],
})
export class CheckInComponent implements OnInit, OnDestroy {
  constructor(
    private ventaConceptosService: VentaConceptosService,
    private ordenVentaService: OrdenVentaService,
    private dialog: MatDialog,
    private citaService: CitaService,
    private campaniasService: CampaniaService,
    private _formBuilder: FormBuilder,
    private dataService: DataService
  ) {}

  ordenVentaServiceSubscription: Subscription;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  origen: string = 'checkin';
  botonHabilitado: boolean = false;
  autocompleteControlPaciente = new UntypedFormControl('');
  orden: OrdenVenta = null;
  listaDeEstudios: VentaConceptos[] = [];
  guardarPresionado: boolean = false;
  citas: Cita[] = [];
  busqueda: string = '';
  citasFiltradas: Cita[] = [];
  codigoPromocion: string = '';
  @ViewChild('qr') textoQr: ElementRef;
  private searchTimer: any;
  folio: string = '';
  pagoRecibido: boolean = false;
  pagos: Pago[] = [];
  descuentos: Descuento[];
  pagoOdescuentoEliminado: boolean = true;
  estudiosList: VentaConceptos[] = [];
  esInstitucion: boolean = false;
  nombreInstitucion: string = null;
  ngOnInit(): void {
    this.buscarCitasHoy();
  }

  buscarCitasHoy() {
    this.citaService.citasDeHoy().subscribe(
      (citas) => {
        let citasNoPagadas: Cita[] = [];
        let ordenesNoPagadas: OrdenVenta[] = [];
        const idsOrdenVenta = citas.map((cita) => cita.estudio.ordenVenta.id);
        console.log(citas);
        this.ordenVentaService.encontrarOrdenesPorIds(idsOrdenVenta).subscribe(
          (data: OrdenVenta[]) => {
            data.forEach((orden) => {
              if (!orden.pagado) {
                ordenesNoPagadas.push(orden);
              }
            });

            citasNoPagadas = citas.filter((cita) =>
              ordenesNoPagadas.some(
                (orden) => orden.id === cita.estudio.ordenVenta.id
              )
            );

            this.citas = citasNoPagadas;
            this.citasFiltradas = citasNoPagadas;
            console.log(this.citas);
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  filtrarAreas() {
    this.citasFiltradas = !this.busqueda
      ? this.citas
      : this.citas.filter((cita) =>
          cita.estudio.concepto.area.nombre.includes(
            this.busqueda.toUpperCase()
          )
        );
  }

  buscarQr() {
    // Limpiar el temporizador existente si existe
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    // Establecer un nuevo temporizador para ejecutar la búsqueda después de un retraso de 1000 ms (1 segundo)
    this.searchTimer = setTimeout(() => {
      this.realizarBusqueda();
    }, 1000);
  }

  private realizarBusqueda() {
    const cuerpoCodigo: string = this.textoQr.nativeElement.value;
    if (cuerpoCodigo == '') {
      return;
    }

    const ids = cuerpoCodigo.split(',');
    if (ids.length != 2) {
      return;
    }
    const pacienteId = +ids[0];
    const ordenId = +ids[1];

    this.cargarOrdenVenta(ordenId, pacienteId);
  }

  recibirPagos(event: Pago[]): void {
    this.pagoRecibido = true;
    this.pagos = event;
  }
  recibirDescuentos(event: Descuento[]): void {
    this.descuentos = event;
  }

  cambioPagosDescuentos(event): void {
    console.log('Quitaron pago o descuento');
    this.pagoRecibido = false;
  }

  pagar(): void {
    if (this.orden.pagado) {
      return;
    }
    Swal.fire({
      title: 'Procesando',
      icon: 'info',
      text: 'Espere mientras termina el proceso',
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    this.botonHabilitado = true;

    if (this.folio) {
      this.orden.folioInstitucion = this.folio;
    }

    this.orden.pagos = this.pagos;
    this.orden.descuentos = this.descuentos;
    this.orden.estudiosList = this.listaDeEstudios;
    setTimeout(() => {
      Swal.close();
      this.ordenVentaServiceSubscription = this.ordenVentaService
        .venderConceptos(this.orden, this.origen)
        .subscribe(
          () => {
            Swal.fire('Éxito', 'Se ha procesado la orden', 'success');
            if (this.esInstitucion) {
              return;
            }
            this.reiniciar();
          },
          (error) => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');
            console.log(error);
            if (this.esInstitucion) {
              return;
            }
            this.reiniciar();
          }
        );
    }, 2000);
  }

  mostrarQrSubirFoto() {
    const modalRef = this.dialog.open(QrSubirFotoOrdenModalComponent, {
      width: '1000px',
      data: { orden: this.orden },
    });
    modalRef.afterClosed().subscribe();
  }

  presionadoBotonGuardar(presionado) {
    this.guardarPresionado = presionado as boolean;
    if (this.esInstitucion) {
      this.pagar();
      return;
    }
    this.calcularPrecio();
  }

  parseHora(horaString: string): Date {
    if (!horaString) {
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
      (estudio) => {
        if (estudio.institucion.id !== 1) {
          this.esInstitucion = true;
        }
        this.nombreInstitucion = estudio.institucion.nombre;
        this.cargarOrdenVenta(estudio.ordenVenta.id, estudio.paciente.id);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private cargarOrdenVenta(ordenId: number, pacienteId: number): void {
    this.ordenVentaService.ver(ordenId).subscribe(
      (orden) => {
        if (orden.paciente.id === pacienteId) {
          this.orden = orden;
          Swal.fire(
            'Guardar paciente',
            'Presione guardar paciente para poder pagar',
            'info'
          );
          this.ventaConceptosService
            .encontrarPorOrdenVentaId(orden.id)
            .subscribe(
              (estudios) => {
                this.listaDeEstudios = estudios;
                this.nombreInstitucion = estudios[0].institucion.nombre;
              },
              (error) => console.log(error)
            );
        } else {
          this.orden = null;
        }
      },
      (error) => {
        console.log(error);
        this.orden = null;
      }
    );
  }

  reiniciar(): void {
    this.orden = null;
    this.listaDeEstudios = [];
    this.guardarPresionado = false;
    this.botonHabilitado = false;
    this.codigoPromocion = '';
    this.folio = null;
    this.esInstitucion = false;
    this.nombreInstitucion = null;
    return;
  }

  cambiar(estudio: VentaConceptos): void {
    const dialogRef = this.dialog.open(CambiarEstudioComponent, {
      data: { estudio: estudio },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((nuevoConcepto) => {
      if (nuevoConcepto) {
        this.listaDeEstudios = this.listaDeEstudios.filter(
          (e) => e.concepto !== estudio.concepto
        );
        estudio.concepto = nuevoConcepto;
        this.listaDeEstudios.push(estudio);
        this.calcularPrecio();
      }
    });
  }

  abrirAgregarEstudio(): void {
    const dialogRef = this.dialog.open(AgregarEstudioComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((venta) => {
      if (venta) {
        this.listaDeEstudios.push(venta);
        this.calcularPrecio();
      }
    });
  }

  buscarCodigoPromocional(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.codigoPromocion) {
      this.campaniasService.buscarPorCodigo(this.codigoPromocion).subscribe(
        (campania) => {
          if (campania.id) {
            this.orden.aplicarDescuento = true;
            this.orden.codigoPromocional = campania.codigo;
          }
          Swal.fire(
            'Aplicado',
            `Campania ${campania.nombre} aplicada con éxito: ${campania.descripcion}`,
            'success'
          );
        },
        () => {
          Swal.fire(
            'No encontrado',
            'No se ha podido encontrar la campaña',
            'error'
          );
        }
      );
    }
  }

  calcularPrecio() {
    let total: number = 0;
    if (this.esInstitucion) {
      this.dataService.actualizarPrecio(total);
      this.orden.totalSinDescuento = total;
      return;
    }
    for (let estudio of this.listaDeEstudios) {
      total += estudio.concepto.precio;
    }
    this.dataService.actualizarPrecio(total);
    this.orden.totalSinDescuento = total;
  }

  cambiarInstitucion() {
    const modalRef = this.dialog.open(SeleccionarInstitucionComponent, {
      width: '500px',
    });

    modalRef.afterClosed().subscribe(
      (data: Institucion) => {
        if (data) {
          console.log(data);
          this.ordenVentaService
            .cambiarInstitucion(this.orden.id, data.id)
            .subscribe(
              (data) => {
                console.log(data);
                for (let estudio of this.listaDeEstudios) {
                  estudio.institucion = data;
                }
                console.log('paso el for');
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Error al cambiar la institución',
                });
                console.log(error);
              }
            );
          this.nombreInstitucion = data.nombre;
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al seleccionar la institución',
        });
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    console.log('desruyendo');
    this.ordenVentaServiceSubscription &&
      this.ordenVentaServiceSubscription.unsubscribe();
  }
}
