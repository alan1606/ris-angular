import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class MedicosGuard implements CanActivate {
  
  constructor(
    private tokenService: TokenService){
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return of(this.tokenService.isAdmin() || this.tokenService.isTechnician()|| this.tokenService.isReceptionist());
  }
  
}
