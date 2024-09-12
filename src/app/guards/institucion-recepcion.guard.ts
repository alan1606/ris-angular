import { CanActivate } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class InstitucionRecepcionGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(): Observable<boolean> {
    return of(
      this.tokenService.isInstitution() ||
        this.tokenService.isReceptionist() ||
        this.tokenService.isAdmin()
    );
  }
}
