import { Component, OnInit } from '@angular/core';
import { authorize_uri, client_id, code_challenge_method, logour_uri, post_logout_redirect_uri, redirect_uri, response_type, scope } from 'src/app/config/app';
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
  logout_url = logour_uri;

  loginParams: any = {
    client_id : client_id,
    redirect_uri : redirect_uri,
    scope : scope,
    response_type : response_type,
    code_challenge_method : code_challenge_method
  };

  logoutParams: any = {
    client_id: client_id,
    post_logout_redirect_uri: post_logout_redirect_uri
  };

  isLogged: boolean = false;
  isAdmin: boolean = false;
  isReceptionist: boolean = false;
  isRadiologicPhysician: boolean = false;
  isTechnician: boolean = false;

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

    this.loginParams.code_challenge = this.generateCodeChallenge(code_verifier);
    const httpParams = new HttpParams({fromObject: this.loginParams});
    const codeUrl = this.authorize_url + httpParams.toString();
    console.log(codeUrl);
    location.href = codeUrl;
  }


  onLogout(): void{
    const httpParams = new HttpParams({fromObject: this.logoutParams});
    this.logoutParams.refresh_token = this.tokenService.getRefreshToken();
    const codeUrl = this.logout_url + httpParams.toString();
    console.log(codeUrl);
    location.href = codeUrl;
  }

  getLogged(): void{
    this.tokenService.isLogged().subscribe(logged => this.isLogged = logged);
    this.tokenService.isAdmin().subscribe(admin => this.isAdmin = admin);
    this.tokenService.isReceptionist().subscribe(receptionist => this.isReceptionist = receptionist);
    this.tokenService.isRadiologicPhysician().subscribe(physiscian => this.isRadiologicPhysician = physiscian);
    this.tokenService.isTechnician().subscribe(technician => this.isTechnician = technician);
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

  puedeAbrirAgenda(): boolean{
    if(this.isAdmin || this.isReceptionist){
      return true;
    }
    return false;
  }

  puedeAbrirAgendados(): boolean{
    if(this.isAdmin || this.isReceptionist){
      return true;
    }
    return false;
  }

  puedeAbrirEnvioDeEstudios(): boolean{
    if(this.isAdmin || this.isReceptionist){
      return true;
    }
    return false;
  }

  puedeAbrirVentaConceptos(): boolean{
    if(this.isAdmin || this.isTechnician ){
      return true;
    }
    return false;
  }

  puedeAbrirWorklist(): boolean{
    if(this.isAdmin || this.isTechnician){
      return true;
    }
    return false;
  }

  puedeAbrirCampanias(): boolean{
    if(this.isAdmin){
      return true;
    }
    return false;
  }
}
