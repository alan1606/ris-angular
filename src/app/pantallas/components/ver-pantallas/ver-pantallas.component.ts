import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TurneroSubscription } from 'src/app/models/TurneroSubscription';
import { TurneroSocketService } from 'src/app/turnero/services/turnero-socket.service';
import { DicomRoom } from '../../models/DicomRoom';
import { PantallasService } from '../../services/pantallas.service';
import { Pantalla } from '../../models/Pantalla';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-pantallas',
  templateUrl: './ver-pantallas.component.html',
  styleUrl: './ver-pantallas.component.css',
})
export class VerPantallasComponent implements OnInit {
  private pantallasService = inject(PantallasService);
  private turneroSocketService = inject(TurneroSocketService);
  private alertaService = inject(AlertaService);
  private cdr = inject(ChangeDetectorRef);
  public subscriptions = signal<TurneroSubscription[]>([]);
  public estudios: any[] = [];
  public salas: DicomRoom[] = [];
  public waitingTurns: Pantalla[] = [];
  public pasar: Pantalla[] = [];
  public indexes: number[] = [];

  ngOnInit(): void {
    Swal.fire({
      icon: 'info',
      html: `
      <audio autoplay style="display:none;">
      <source src="../../../../assets/ponten4.mp3" type="audio/mpeg">
      </audio>`,
      toast: true,
      position: 'bottom-right',
      showConfirmButton: false,
      showCancelButton: false,
      width:'0px'
    });
    let hoy = new Date().getDate();
    let fechaPantallas = parseInt(localStorage.getItem('fechaPantallas'));
    console.log(hoy);
    if (!fechaPantallas) {
      localStorage.setItem('fechaPantallas', hoy.toString());
    }
    if (fechaPantallas) {
      console.log(
        'entro a ver si la fecha de hoy es iguala la fecha de los items guardados en pantallas'
      );
      if (hoy !== fechaPantallas) {
        localStorage.removeItem('Turnos');
        localStorage.removeItem('Pasar');
        localStorage.setItem('fechaPantallas', hoy.toString());
        console.log('elimino todo');
      }
    }

    this.pantallasService.findAllEnabled().subscribe(
      (data) => {
        this.salas = data;
        this.waitingTurns = this.salas as Pantalla[];
        this.pasar = this.salas as Pantalla[];
        const turnosGuardados = localStorage.getItem('Turnos');
        const pasarGuardados = localStorage.getItem('Pasar');

        if (turnosGuardados) {
          this.waitingTurns = JSON.parse(turnosGuardados) as Pantalla[];
          console.log(this.waitingTurns);
        }
        if (pasarGuardados) {
          this.pasar = JSON.parse(pasarGuardados) as Pantalla[];
        }
      },
      (error) => console.log(error)
    );

    this.studyTakenListener();
  }

  private studyTakenListener(): void {
    this.turneroSocketService.nuevoEvento$.subscribe((data: any) => {
      if (data?.idToDisplay) {
        console.log('Data en el evento de pantallas', data);
        if (data?.idToDisplay && !data.arrivedTime) {
          console.log('entro el if pasar');
          this.showTurnToPass(data);
          this.deletePassingStudies(data);
          return;
        }

        console.log('entro hacia turnos');
        this.addTurn(data);
        return;
      }
    });
  }

  public eliminarTurnoManual(turno: any): void {
    this.waitingTurns.forEach((t) => {
      if (Array.isArray(t.turnos)) {
        t.turnos = t.turnos.filter((l) => l.idToDisplay !== turno.idToDisplay);
      }
    });
  }

  public eliminarPasarManual(turno: any): void {
    this.pasar.forEach((t) => {
      if (Array.isArray(t.turnos)) {
        t.turnos = t.turnos.filter((l) => l.idToDisplay !== turno.idToDisplay);
      }
    });
  }

  private addTurn(data: any): void {
    let salaPantalla = this.waitingTurns.find(
      (sala) => sala.id === data.dicomRoomId
    );
    if (salaPantalla) {
      if (!salaPantalla.turnos) {
        salaPantalla.turnos = [];
      }
      salaPantalla.turnos.unshift(data);
      localStorage.setItem('Turnos', JSON.stringify(this.waitingTurns));
      this.cdr.detectChanges();
    }
  }

  private showTurnToPass(data: any): void {
    let pasarPantalla = this.pasar.find((sala) => sala.id === data.dicomRoomId);
    if (pasarPantalla) {
      if (!pasarPantalla.turnos) {
        pasarPantalla.turnos = [];
      }
      pasarPantalla.turnos[0] = data;
      localStorage.setItem('Pasar', JSON.stringify(this.pasar));
      Swal.fire({
        icon: 'info',
        html: `
        <audio autoplay style="display:none;">
        <source src="../../../../assets/ponten4.mp3" type="audio/mpeg">
        </audio>`,
        toast: true,
        position: 'bottom-right',
        showConfirmButton: false,
        showCancelButton: false,
        width: '0px',
      });
    }
  }

  private deletePassingStudies(data: any): void {
    this.waitingTurns.forEach((t) => {
      if (Array.isArray(t.turnos)) {
        t.turnos = t.turnos.filter((l) => l.idToDisplay !== data.idToDisplay);
      }
    });
    localStorage.setItem('Turnos', JSON.stringify(this.waitingTurns));
    this.cdr.detectChanges();
  }
}
