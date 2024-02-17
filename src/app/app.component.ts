import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './layout/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'ris';

  @ViewChild('menu') menu: NavbarComponent;

  constructor(
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe(() => {
      this.menu.getLogged();
    });

    if ('caches' in window) {
      caches.keys()
        .then(function (keyList) {
          return Promise.all(keyList.map(function (key) {
            return caches.delete(key);
          }));
        })
    }


    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations()
        .then(function (registrations) {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
    }
  }



}
