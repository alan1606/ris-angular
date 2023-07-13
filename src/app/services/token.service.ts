import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { secret_pkce } from '../config/app';
import { Observable, of } from 'rxjs';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const CODE_VERIFIER = 'code_verifier';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  setTokens(accessToken: string, refresToken: string): void{
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.setItem(ACCESS_TOKEN, accessToken);

    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.setItem(REFRESH_TOKEN, refresToken);

  }

  getAccessToken(): string | null{
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getRefreshToken(): string | null{
    return localStorage.getItem(REFRESH_TOKEN);
  }

  logOut(): void{
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  isLogged(): Observable<boolean>{
    let result: boolean = localStorage.getItem(ACCESS_TOKEN) != null;
    return of(result);
  }


  isAdmin():  Observable<boolean>{

    if(!this.isLogged()){
      return of(false);
    }

    const token = this.getAccessToken();

    if(!token){
      return of(false);
    }

    const payload = token.split('.')[1];

    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    const roles = values.realm_access.roles;
    if(roles.indexOf('ADMIN') < 0){
      return of(false);
    }

    return of(true);

  }

  setVerifier(codeVerifier: string): void{
    if(localStorage.getItem(CODE_VERIFIER)){
      this.deleteVerifier();
    }
    const encrypted = CryptoJS.AES.encrypt(codeVerifier, secret_pkce);
    localStorage.setItem(CODE_VERIFIER, encrypted.toString());
  }


  getVerifier(): string{
    const encrypted = localStorage.getItem(CODE_VERIFIER);
    const decrypted = CryptoJS.AES.decrypt(encrypted, secret_pkce).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }

  deleteVerifier(): void{
    localStorage.removeItem(CODE_VERIFIER);
  }
}
