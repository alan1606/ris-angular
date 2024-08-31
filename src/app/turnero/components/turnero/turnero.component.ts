import { Component, inject, OnInit, signal } from '@angular/core';
import { Area } from 'src/app/models/area';
import { EquipoDicom } from 'src/app/models/equipo-dicom';
import { TurneroService } from '../../services/turnero.service';
import { TokenService } from 'src/app/services/token.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { TurneroSubscription } from 'src/app/models/TurneroSubscription';
import { DataService } from 'src/app/shared/services/data.service';
import { TurneroSocketService } from '../../services/turnero-socket.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { VerFotoOrdenComponent } from '../ver-foto-orden/ver-foto-orden.component';

@Component({
  selector: 'app-turnero',
  templateUrl: './turnero.component.html',
  styleUrl: './turnero.component.css',
})
export class TurneroComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  private turneroService = inject(TurneroService);
  private turneroSocketService = inject(TurneroSocketService);
  private tokenService = inject(TokenService);
  private alertaService = inject(AlertaService);

  private user = this.tokenService.getUsername();
  private dataService = inject(DataService);

  public studiesColumns: string[] = [
    'Paciente',
    'Estudio',
    'Llegada',
    'Cita',
    'Estado',
    'Asociados',
    'Foto',
    'Tomar',
  ];
  public expandedPanel: number | null = null;

  public subscriptions = signal<TurneroSubscription[]>([]);
  public subscriptionsDataSource: any[] = [];

  public estudios: any = [];
  public studiesDataSource: any[] = [];

  public area = signal<Area>(new Area());
  public sala = signal<EquipoDicom>(new EquipoDicom());

  ngOnInit(): void {
    this.searchSubscriptions();
    this.studyTakenListener();
    let lastRoom = parseInt(localStorage.getItem('roomId'));
    console.log(lastRoom);
    if (lastRoom) {
      this.expandedPanel = lastRoom;
      this.searchStudiesByRoomId(lastRoom);
    }
  }

  public searchSubscriptions(): void {
    this.turneroService.findSubscriptionsByUser(this.user).subscribe(
      (subscriptionsData) => {
        this.subscriptions.set(subscriptionsData);
        this.subscriptionsDataSource = this.subscriptions();
        console.log(this.subscriptions());
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }

  public searchStudiesByRoomId(dicomRoomId: number): void {
    console.log('buscando estudios');
    let roomId = dicomRoomId;
    this.expandedPanel = roomId ? roomId : this.expandedPanel;
    localStorage.setItem('roomId', roomId.toString());
    this.turneroService.workListByRoomId(roomId).subscribe(
      (data) => {
        this.estudios = data;
        this.studiesDataSource = this.estudios;
        console.log(this.estudios);
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }

  public takeStudy(studyId: number): void {
    Swal.fire({
      title: '¿Desea pasar al paciente?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
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
    });
  }

  private studyTakenListener(): void {
    this.turneroSocketService.nuevoEvento$.subscribe(
      (data) => {
        if (data?.dicomRoomId === this.expandedPanel) {
          this.searchStudiesByRoomId(data);
          return;
        }
        return;
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
        () => {
          this.searchSubscriptions();
        },
        (error) => {
          this.alertaService.error(error);
        }
      );
  }

  public verFotoOrden(idEstudio: number): void {
    const dialogRef = this.dialog.open(VerFotoOrdenComponent, {
      data: { idEstudio },
    });
  }


  public unsubscribe(salaId: number): void {
    Swal.fire({
      title: '¿Seguro que quiere dejar de ver estudios de esta sala?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
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
    });
  }
}
