import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class VentaConceptosGuard  {
  constructor(
    private tokenService: TokenService){
  }

  

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const puede: boolean = this.tokenService.isAdmin() || this.tokenService.isTechnician();
    return of( puede );
  }
  
}
