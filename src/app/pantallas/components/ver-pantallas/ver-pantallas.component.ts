import { Component, inject, OnInit, signal } from '@angular/core';
import { TurneroSubscription } from 'src/app/models/TurneroSubscription';
import { TokenService } from 'src/app/services/token.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { TurneroSocketService } from 'src/app/turnero/services/turnero-socket.service';
import { TurneroService } from 'src/app/turnero/services/turnero.service';
import { DicomRoom } from '../../models/DicomRoom';
import { TurneroEvent } from 'src/app/turnero/models/TurneroEvent';
import { from } from 'rxjs';
import { concatMap, toArray } from 'rxjs/operators';
import { PantallasService } from '../../services/pantallas.service';
import { Turno } from '../../models/Turno';
import { Pantalla } from '../../models/Pantalla';

@Component({
  selector: 'app-ver-pantallas',
  templateUrl: './ver-pantallas.component.html',
  styleUrl: './ver-pantallas.component.css',
})
export class VerPantallasComponent implements OnInit {
  private alertaService = inject(AlertaService);
  private pantallasService = inject(PantallasService);
  private turneroService = inject(TurneroService);
  private turneroSocketService = inject(TurneroSocketService);
  private tokenService = inject(TokenService);
  private user = this.tokenService.getUsername();
  public subscriptions = signal<TurneroSubscription[]>([]);
  public estudios: any[] = [];
  public salas: DicomRoom[] = [];
  public turnos: Pantalla[] = [];

  // event = {
  //   dicomRoomId: 7,
  //   idToDisplay: 'MRI1-3',
  //   studyId: 64777,
  //   user: 'dany',
  // };

  ngOnInit(): void {
    this.studyTakenListener();

    this.pantallasService.findAllEnabled().subscribe(
      (data) => {
        this.salas = data;
        this.turnos = this.salas as Pantalla[];
        const turnosGuardados = localStorage.getItem('Turnos');
        if (turnosGuardados) {
          this.turnos = JSON.parse(turnosGuardados) as Pantalla[];
        }
      },
      (error) => console.log(error)
    );
  }

  private studyTakenListener(): void {
    this.turneroSocketService.nuevoEvento$.subscribe((data: Turno) => {
      if (data?.idToDisplay) {
        console.log('Data en el evento de pantallas', data);
        //ejemplo: data.idToDisplay="RMI1-7"
        let salaP = this.turnos.find((sala) => sala.id === data.dicomRoomId);
        if (salaP) {
          console.log(salaP);
          if (!salaP.turnos) {
            salaP.turnos = [];
          }
          salaP.turnos.push(data);
        }
        localStorage.setItem('Turnos', JSON.stringify(this.turnos));
      }
    });
  }

  // public turnoParaSala(displayId: string, sala: string): boolean {
  //   let [turno] = displayId.split('-');
  //   if (turno === sala) {
  //     return true;
  //   }
  //   return false;
  // }
}
