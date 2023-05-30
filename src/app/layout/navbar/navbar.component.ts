import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  /*logout(): void{
    const usuario = this.authService.usuario;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${usuario.username} has cerrado sesión con éxito`, 'success');
    this.router.navigate(['/login']);
  }*/

}
