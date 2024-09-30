import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { TurneroSocketService } from './turnero/services/turnero-socket.service';
import { TokenService } from './services/token.service';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('menu') menu: NavbarComponent;
  private tokenService = inject(TokenService);
  private logged: boolean = this.tokenService.isLogged();
  public isVerPantallas: boolean = false;
  constructor(
    private router: Router,
    private turneroSocketService: TurneroSocketService
  ) {}

  ngOnInit(): void {
    const url = document.location.pathname;
    if (url === '/ris/pantallas/ver') {
      this.isVerPantallas = true;
    }
    console.log('url si: ', url);
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.menu.getLogged();
      });

    interval(1000)
      .pipe(takeWhile(() => !this.logged))
      .subscribe(() => {
        this.logged = this.tokenService.isLogged();
        console.log('conectando', this.logged);
        if (this.logged) {
          let tecnico =
            this.tokenService.isTurnero() || this.tokenService.isAdmin();
          this.turneroSocketService.initConnectionSocket(
            this.tokenService.getUsername(),
            tecnico
          );
        }
      });
    if (this.logged) {
      console.log('logged');
      this.turneroSocketService.initConnectionSocket();
    }
  }
}
