import { Component, inject, OnInit, signal } from '@angular/core';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { TurneroService } from '../../services/turnero.service';
import { TokenService } from 'src/app/services/token.service';
import { error } from 'console';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { TurneroSubscription } from 'src/app/models/TurneroSubscription';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-turnero',
  templateUrl: './turnero.component.html',
  styleUrl: './turnero.component.css',
})
export class TurneroComponent implements OnInit {
  private turneroService = inject(TurneroService);
  private tokenService = inject(TokenService);
  private alertaService = inject(AlertaService);
  private user = this.tokenService.getUsername();
  private dataService = inject(DataService);
  displayedColumns: string[] = ['Area', 'Sala', 'Dejar de ver'];
  dataSource = [
    { area: 'Ultrasonido', sala: 'Ultrasonido dr martinez', id: 1 },
    { area: 'Tomografia', sala: 'Tomografia', id: 2 },
    { area: 'Resonancia magnetica', sala: 'Resonancia', id: 3 },
  ];
  area = signal(new Area());
  sala = signal(new EquipoDicom());
  subscriptions = signal<TurneroSubscription[]>([]);

  ngOnInit(): void {
    this.turneroService.findSubscriptionsByUser(this.user).subscribe(
      (suscriptionsData) => {
        this.subscriptions.set(suscriptionsData);
        if (this.subscriptions().length > 0) {
          for (let subs of this.subscriptions()) {
            this.turneroService.subscribeUserToRoom(
              this.user,
              subs.dicomRoomId
            );
          }
        }
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }

  public areaSelected(area: Area): void {
    this.area.set(area);
    this.dataService.updateAreaData(this.area());
  }

  public suscribe(): void {
    return;
    this.turneroService.subscribeUserToRoom(this.user, this.sala().id);
  }

  public quitar(salaId: number): void {
    console.log(salaId);
    console.log(this.user);
    return;
    this.turneroService.unsuscribeUserOfRoom(this.user, salaId).subscribe(
      () => {
        this.alertaService.exito('Desuscripcion', 'realizada con exito!!!');
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }
}
