import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { TurneroService } from '../../services/turnero.service';
import { TokenService } from 'src/app/services/token.service';
import { error } from 'console';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { TurneroSubscription } from 'src/app/models/TurneroSubscription';
import { DataService } from 'src/app/shared/services/data.service';
import { Study } from 'src/app/models/study';
import { TurneroSocketService } from '../../services/turnero-socket.service';

@Component({
  selector: 'app-turnero',
  templateUrl: './turnero.component.html',
  styleUrl: './turnero.component.css',
})
export class TurneroComponent implements OnInit {
  private turneroService = inject(TurneroService);
  private turneroSocketService = inject(TurneroSocketService);
  private tokenService = inject(TokenService);
  private alertaService = inject(AlertaService);
  private user = this.tokenService.getUsername();
  private dataService = inject(DataService);

  subscriptionsColumns: string[] = ['Area', 'Dejar de ver'];
  studiesColumns: string[] = ['Paciente', 'Estudio', 'Estado'];
  subscriptionsDataSource: any[] = [];
  studiesDataSource: any[] = [];
  area = signal<Area>(new Area());
  sala = signal<EquipoDicom>(new EquipoDicom());
  estudios = signal<Study>(new Study());
  subscriptions = signal<TurneroSubscription[]>([]);

  ngOnInit(): void {
    this.searchSubscriptions();
  }

  public searchSubscriptions(): void {
    this.turneroService.findSubscriptionsByUser(this.user).subscribe(
      (subscriptionsData) => {
        this.subscriptions.set(subscriptionsData);
        console.log(this.subscriptions());
        this.subscriptionsDataSource = this.subscriptions();
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

  public subscribe(): void {
    this.turneroService
      .subscribeUserToRoom(this.user, this.sala().id)
      .subscribe(
        (data) => {
          console.log(data);
          this.searchSubscriptions();
        },
        (error) => {
          this.alertaService.error(error);
        }
      );
  }

  public quitar(salaId: number): void {
    this.turneroService.unsuscribeUserOfRoom(this.user, salaId).subscribe(
      () => {
        this.alertaService.exito('Desuscripcion', 'realizada con exito!!!');
        this.searchSubscriptions();
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }
}
