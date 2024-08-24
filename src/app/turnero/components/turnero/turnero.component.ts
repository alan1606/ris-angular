import { Component, inject, OnInit, signal } from '@angular/core';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { TurneroService } from '../../services/turnero.service';
import { TokenService } from 'src/app/services/token.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { TurneroSubscription } from 'src/app/models/TurneroSubscription';
import { DataService } from 'src/app/shared/services/data.service';
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
  // subscriptionsColumns: string[] = ['Area', 'Dejar de ver'];
  public studiesColumns: string[] = [
    'Paciente',
    'Estudio',
    'Estado',
    'Tecnico',
    'Hora llegada',
    'Hora cita',
    'Tomar',
  ];
  public expandedPanel: number | null = null;

  public subscriptionsDataSource: any[] = [];
  public studiesDataSource: any[] = [];

  public area = signal<Area>(new Area());
  public sala = signal<EquipoDicom>(new EquipoDicom());
  public estudios: any = [];
  public subscriptions = signal<TurneroSubscription[]>([]);

  ngOnInit(): void {
    this.searchSubscriptions();
    this.studyTakenListener();
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

  public searchStudiesByRoomId(subscription): void {
    this.expandedPanel = subscription.id? subscription.id : this.expandedPanel;
    this.turneroService.workListByRoomId(subscription.dicomRoomId).subscribe(
      (data) => {
        this.estudios = data;
        this.studiesDataSource = this.estudios;
        console.log(this.estudios)
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }

  public takeStudy(studyId: number): void {
    this.turneroService.takeStudy(studyId, this.user).subscribe(
      (data) => {
        console.log(data);
        let takenStudy = this.estudios.find((e) => e.studyId === studyId);
        takenStudy.status = 'PROCESSING';
        this.studiesDataSource = this.estudios;
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }

  private studyTakenListener(): void {
    this.turneroSocketService.nuevoEvento$.subscribe(
      (data) => {
        this.searchStudiesByRoomId(data);
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
