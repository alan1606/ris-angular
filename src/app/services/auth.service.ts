import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { client_id, code_verifier, grant_type, redirect_uri, scope, token_url } from '../config/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenUrl = token_url;

  constructor(private httpClient: HttpClient) { }

  public getToken(code: string): Observable<any>{
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


}
