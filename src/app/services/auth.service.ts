import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_PASSWORD, APP_USER, BASE_ENDPOINT } from '../config/app';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private  baseEndpoint = BASE_ENDPOINT +  '/security/oauth/token';
  private _usuario: Usuario;
  private _token: string;

  constructor(private httpClient: HttpClient) { }

  public get usuario(): Usuario{
    if(this._usuario != null){
      return this._usuario;
    }
    else if(sessionStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
      return new Usuario();
  }

  public get token(): string{
    if(this._token != null){
      return this._token;
    }
    else if(sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('usuario');
      return this._token;
    }
      return null;
  }

  login(usuario: Usuario): Observable<any>{
    const credenciales = btoa(`${APP_USER}:${APP_PASSWORD}`);

    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + credenciales 
    });

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    return this.httpClient.post<any>(this.baseEndpoint, params.toString(), {headers: httpHeaders});
  }

  guardarToken(accessToken: any) {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  guardarUsuario(accessToken: any) {
    let payload = this.obtenerDatosToken(accessToken);

    this._usuario = new Usuario;
    this._usuario.username = payload.user_name;
    this._usuario.enabled = payload.enabled;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  isAuthenticated(): boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload == null){
      return false;
    }
    if(!payload.user_name){
      console.log(payload);
      return false;
    }
    if(payload.user_name.length < 1){
      return false;
    }
    return true;
  }

  obtenerDatosToken(accessToken: string): any{
    if(accessToken != null){
      return  JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }


  logout() {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
  }

}
