import { Injectable } from '@angular/core';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

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
}
