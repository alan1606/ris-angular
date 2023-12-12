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
    localStorage.setItem(ACCESS_TOKEN, accessToken);
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

  isLogged(): boolean{
    let result: boolean = localStorage.getItem(ACCESS_TOKEN) != null && localStorage.getItem(REFRESH_TOKEN) != null;
    return result;
  }


  isAdmin():  boolean{
   return this.isRole('ADMIN');
  }

  isReceptionist(): boolean{
    return this.isRole('RECEPCIONISTA');
  }

  isRadiologicPhysician(): boolean{
    return this.isRole('MEDICO_RADIOLOGO');
  }

  isTechnician(): boolean{
    return this.isRole('TECNICO');
  }

  isInstitution(): boolean{
    return this.isRole("INSTITUCION");
  }

  private isRole(role: string) : boolean{
    if(!this.isLogged()){
      return false;
    }

    const token = this.getAccessToken();

    if(!token){
      return false;
    }

    const payload = token.split('.')[1];

    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    const roles = values.resource_access.rispacs.roles;
    if(roles.indexOf(role) < 0){
      return false;
    }

    return true;
  }

  getUsername(): string {
    if(!this.isLogged()){
      return '';
    }

    const token = this.getAccessToken();

    if(!token){
      return '';
    }

    const payload = token.split('.')[1];

    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    const username = values.preferred_username;

    return username;
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




  
  isAccessTokenExpired(): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return true;
    }

    const payload = this.decodeTokenPayload(accessToken);
    if (!payload || !payload.exp) {
      return true;
    }

    // La fecha de expiración está en segundos, convertimos a milisegundos
    const expirationDate = new Date(payload.exp * 1000);
    const now = new Date();
    return expirationDate.getTime() < now.getTime();
  }

  isRefreshTokenExpired(): boolean {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return true;
    }

    const payload = this.decodeTokenPayload(refreshToken);
    if (!payload || !payload.exp) {
      return true;
    }

    // La fecha de expiración está en segundos, convertimos a milisegundos
    const expirationDate = new Date(payload.exp * 1000);
    const now = new Date();
    return expirationDate.getTime() < now.getTime();
  }

  private decodeTokenPayload(token: string): any {
    if (!token) {
      return null;
    }

    const payloadBase64 = token.split('.')[1];
    try {
      const payloadDecoded = atob(payloadBase64);
      return JSON.parse(payloadDecoded);
    } catch (error) {
      console.error("Error decoding token payload:", error);
      return null;
    }
  }


}
