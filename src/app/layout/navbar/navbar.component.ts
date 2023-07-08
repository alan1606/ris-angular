import { Component, OnInit } from '@angular/core';
import { authorize_uri, client_id, code_challenge_method, redirect_uri, response_type, scope } from 'src/app/config/app';
import { HttpParams } from '@angular/common/http';
import { TokenService } from 'src/app/services/token.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwkyz123456789';

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
    code_challenge_method : code_challenge_method
  };

  isLogged: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLogged();
  }



  onLogin(): void{
    const code_verifier = this.generateCodeVerifier();
    this.tokenService.setVerifier(code_verifier);

    this.params.code_challenge = this.generateCodeChallenge(code_verifier);
    const httpParams = new HttpParams({fromObject: this.params});
    const codeUrl = this.authorize_url + httpParams.toString();
    console.log(codeUrl);
    location.href = codeUrl;
  }


  onLogout(): void{
    this.tokenService.logOut();
    this.router.navigate(['/agenda']);
  }

  getLogged(): void{
    this.tokenService.isLogged().subscribe(logged => this.isLogged = logged);
    this.tokenService.isAdmin().subscribe(admin => this.isAdmin = admin);
  }


  generateCodeVerifier(): string{
    let result = '';
    const char_length = CHARACTERS.length;

    for(let i=0; i<44; i++){
      result += CHARACTERS.charAt(Math.floor(Math.random() * char_length));
    }

    return result;
  }


  generateCodeChallenge(code_verifier: string): string{
    const codeVerifierHash = CryptoJS.SHA256(code_verifier).toString(CryptoJS.enc.Base64);
    const code_challenge = codeVerifierHash
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

    return code_challenge;
  }

  /*logout(): void{
    const usuario = this.authService.usuario;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${usuario.username} has cerrado sesión con éxito`, 'success');
    this.router.navigate(['/login']);
  }*/

}
