import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OnlyRecepcionGuard  {
  
  constructor(
    private tokenService: TokenService){
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return of(this.tokenService.isReceptionist());
  }
  
}
