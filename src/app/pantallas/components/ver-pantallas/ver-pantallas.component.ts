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


@Component({
  selector: 'app-ver-pantallas',
  templateUrl: './ver-pantallas.component.html',
  styleUrl: './ver-pantallas.component.css',
})
export class VerPantallasComponent implements OnInit {
  private alertaService = inject(AlertaService);

  private turneroService = inject(TurneroService);
  private turneroSocketService = inject(TurneroSocketService);
  private tokenService = inject(TokenService);
  private user = this.tokenService.getUsername();
  public subscriptionsDataSource;
  public subscriptions = signal<TurneroSubscription[]>([]);
  public estudios: any[] = [];
  public studiesDataSource: any[] = [];

  constructor() {}
  ngOnInit(): void {
    this.turneroService.findSubscriptionsByUser(this.user).subscribe(
      (subscriptionsData) => {
        this.subscriptions.set(subscriptionsData);
        this.subscriptionsDataSource = this.subscriptions();
        console.log(this.subscriptions());
        let salasIds = [];
        for (let i of this.subscriptions()) {
          salasIds.push(i.id);
        }
        from(salasIds)
        .pipe(
          concatMap((id) => this.turneroService.workListByRoomId(id)),
          toArray()
        )
        .subscribe(
          (resultList) => {
            console.log(resultList); // Array con todos los resultados
          },
          (error) => {
            this.alertaService.error(error);
          }
        );
      },
      (error) => {
        this.alertaService.error(error);
      }
    );
  }

}
