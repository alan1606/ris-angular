import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { client_id, grant_type, grant_type_refresh, redirect_uri, scope, token_url } from '../config/app';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenUrl = token_url;

  constructor(private httpClient: HttpClient,
    private tokenService: TokenService) { }

  public getToken(code: string, code_verifier: string): Observable<any>{
    let body = new URLSearchParams();
    body.set("grant_type", grant_type);
    body.set("client_id", client_id);
    body.set("redirect_uri", redirect_uri);
    body.set("scope", scope);
    body.set("code_verifier", code_verifier);
    body.set("code", code);
    const basic_auth = 'Basic' + btoa('client:secret');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Authorization': basic_auth
    });
    const httpOptions = { headers: httpHeaders };
    return this.httpClient.post<any>(this.tokenUrl, body, httpOptions);
  }

  //public logout()


  public refreshToken(): Observable<any> {
    let body = new URLSearchParams();
    body.set("grant_type", grant_type_refresh);
    body.set("client_id", client_id);
    //body.set("redirect_uri", redirect_uri);
    //body.set("scope", scope);
    //body.set("code_verifier", code_verifier);
    //body.set("code", code);
    body.set("refresh_token", this.tokenService.getRefreshToken());
    //const basic_auth = 'Basic' + btoa('client:secret');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
     // 'Authorization': basic_auth
    });
    const httpOptions = { headers: httpHeaders };
    return this.httpClient.post<any>(this.tokenUrl, body, httpOptions);

  }

}
