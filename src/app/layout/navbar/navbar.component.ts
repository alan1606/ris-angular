import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import {MatSelectModule} from '@angular/material/select';
import { authorize_uri, client_id, code_challenge, code_challenge_method, code_verifier, redirect_uri, response_type, scope } from 'src/app/config/app';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  authorize_url = authorize_uri;

  params: any = {
    client_id : client_id,
    redirect_uri : redirect_uri,
    scope : scope,
    response_type : response_type,
    //response_mode : response_mode,
    code_challenge_method : code_challenge_method,
    code_challenge : code_challenge,
    code_verifier : code_verifier
  };

  constructor(public authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }



  onLogin(): void{
    const httpParams = new HttpParams({fromObject: this.params});
    const codeUrl = this.authorize_url + httpParams.toString();
    console.log(codeUrl);
    location.href = codeUrl;
  }

  /*logout(): void{
    const usuario = this.authService.usuario;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${usuario.username} has cerrado sesión con éxito`, 'success');
    this.router.navigate(['/login']);
  }*/

}
