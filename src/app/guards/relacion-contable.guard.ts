import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class RelacionContableGuard  {
  constructor(private tokenService: TokenService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let user = this.tokenService.getUsername();
    let radiologo = this.tokenService.isRadiologicPhysician();
    let admin = this.tokenService.isAdmin();
    if (user !== 'scarrera' && radiologo || user!=='scarrera' && admin) {
      return true;
    }
    return false;
  }
}
