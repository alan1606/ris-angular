import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { TurneroSocketService } from './turnero/services/turnero-socket.service';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('menu') menu: NavbarComponent;
  private tokenService = inject(TokenService);

  constructor(
    private router: Router,
    private turneroSocketService: TurneroSocketService
  ) {
    let isLogged: boolean = this.tokenService.isLogged();
    if (isLogged) {
      this.turneroSocketService.initConnectionSocket();
    }
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.menu.getLogged();
      });

    if ('caches' in window) {
      caches.keys().then(function (keyList) {
        return Promise.all(
          keyList.map(function (key) {
            return caches.delete(key);
          })
        );
      });
    }

    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
  }
}
