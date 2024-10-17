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
import { Pasar } from '../../models/Pasar';
import { Turno } from '../../models/Turno';

@Component({
  selector: 'app-ver-pantallas',
  templateUrl: './ver-pantallas.component.html',
  styleUrl: './ver-pantallas.component.css',
})

export class VerPantallasComponent implements OnInit {
  private pantallasService = inject(PantallasService);
  private turneroSocketService = inject(TurneroSocketService);
  private cdr = inject(ChangeDetectorRef);
  public subscriptions = signal<TurneroSubscription[]>([]);
  public estudios: any[] = [];
  public salas: DicomRoom[] = [];
  public waitingTurns: Pantalla[] = [];
  public pasar: Pasar[] = [];
  public indexes: number[] = [];

  synth: SpeechSynthesis = window.speechSynthesis;
  voices: SpeechSynthesisVoice[] = [];
  utterance = new SpeechSynthesisUtterance();

  constructor() {
    this.synth.onvoiceschanged = () => {
      this.voices = this.synth.getVoices();
      console.log(this.voices);
      if (this.voices.length > 0) {
        if (this.voices[0]) {
          this.utterance.voice = this.voices[0];
        } else {
          console.warn('La voz en el índice no existe.');
        }
      } else {
        console.error('No se encontraron voces disponibles.');
      }
    };
  }

  ngOnInit(): void {
    let hoy = new Date().getDate();
    let fechaPantallas = parseInt(localStorage.getItem('fechaPantallas'));
    if (!fechaPantallas) {
      localStorage.setItem('fechaPantallas: ', hoy.toString());
    }
    if (fechaPantallas) {
      console.log(
        'entro a ver si la fecha de hoy es iguala la fecha de los items guardados en pantallas'
      );
      if (hoy !== fechaPantallas) {
        localStorage.removeItem('Turnos');
        localStorage.removeItem('Pasar');
        localStorage.setItem('fechaPantallas', hoy.toString());
        console.log('Eliminando el localstorage');
      }
    }

    this.pantallasService.findAllEnabled().subscribe(
      (data) => {
        this.salas = data;
        this.waitingTurns = this.salas as Pantalla[];
        this.pasar = this.salas as Pasar[];
        const turnosGuardados = localStorage.getItem('Turnos');
        const pasarGuardados = localStorage.getItem('Pasar');

        if (turnosGuardados) {
          this.waitingTurns = JSON.parse(turnosGuardados) as Pantalla[];
          console.log(this.waitingTurns);
        }
        if (pasarGuardados) {
          this.pasar = JSON.parse(pasarGuardados) as Pasar[];
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
          this.deletePassingStudies(data);
          this.showTurnToPass(data);
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

  public eliminarPasarManual(turno: Turno): void {
    this.pasar.forEach((p) => {
      if (p?.turno?.idToDisplay === turno.idToDisplay) {
        p.turno = null;
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
      if (!pasarPantalla.turno) {
        pasarPantalla.turno = null;
      }
      pasarPantalla.turno = data;
      localStorage.setItem('Pasar', JSON.stringify(this.pasar));
      this.hablar(`Turno ${data.idToDisplay} favor de pasar por la puerta.`);
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

  private hablar(texto: string) {
    this.utterance = new SpeechSynthesisUtterance(texto);
    this.synth.speak(this.utterance);
  }
}