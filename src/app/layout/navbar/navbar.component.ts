import { Component, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import {
  authorize_uri,
  client_id,
  code_challenge_method,
  logour_uri,
  post_logout_redirect_uri,
  redirect_uri,
  response_type,
  scope,
} from 'src/app/config/app';
import { HttpParams } from '@angular/common/http';
import { TokenService } from 'src/app/services/token.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PerfilModalComponent } from 'src/app/perfil/components/perfil-modal/perfil-modal.component';
import {} from '@angular/material/'
const CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwkyz123456789';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showFiller = false;
  authorize_url = authorize_uri;
  logout_url = logour_uri;
  username: string = null;
  loginParams: any = {
    client_id: client_id,
    redirect_uri: redirect_uri,
    scope: scope,
    response_type: response_type,
    code_challenge_method: code_challenge_method,
  };

  logoutParams: any = {
    client_id: client_id,
    post_logout_redirect_uri: post_logout_redirect_uri,
  };

  isLogged: boolean = false;
  isAdmin: boolean = false;
  isReceptionist: boolean = false;
  isReferring: boolean = false;
  isRadiologicPhysician: boolean = false;
  isTechnician: boolean = false;
  isInstitution: boolean = false;
  isTurnero: boolean = false;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getLogged();
  }

  onLogin(): void {
    const code_verifier = this.generateCodeVerifier();
    this.tokenService.setVerifier(code_verifier);

    this.loginParams.code_challenge = this.generateCodeChallenge(code_verifier);
    const httpParams = new HttpParams({ fromObject: this.loginParams });
    const codeUrl = this.authorize_url + httpParams.toString();
    location.href = codeUrl;
  }

  onLogout(): void {
    const httpParams = new HttpParams({ fromObject: this.logoutParams });
    this.logoutParams.refresh_token = this.tokenService.getRefreshToken();
    const codeUrl = this.logout_url + httpParams.toString();
    console.log(codeUrl);
    location.href = codeUrl;
  }

  getLogged(): void {
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
    this.isReceptionist = this.tokenService.isReceptionist();
    this.isRadiologicPhysician = this.tokenService.isRadiologicPhysician();
    this.isTechnician = this.tokenService.isTechnician();
    this.isInstitution = this.tokenService.isInstitution();
    this.isReferring = this.tokenService.isReferring();
    this.isTurnero = this.tokenService.isTurnero();

    this.username = this.tokenService.getUsername();
    if (this.isLogged && this.isTokensExipred()) {
      this.tokenService.logOut();
      this.router.navigate(['/']);
    }
  }

  private isTokensExipred() {
    return (
      this.tokenService.isAccessTokenExpired() &&
      this.tokenService.isRefreshTokenExpired()
    );
  }

  generateCodeVerifier(): string {
    let result = '';
    const char_length = CHARACTERS.length;

    for (let i = 0; i < 44; i++) {
      result += CHARACTERS.charAt(Math.floor(Math.random() * char_length));
    }

    return result;
  }

  generateCodeChallenge(code_verifier: string): string {
    const codeVerifierHash = CryptoJS.SHA256(code_verifier).toString(
      CryptoJS.enc.Base64
    );
    const code_challenge = codeVerifierHash
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return code_challenge;
  }

  puedeAbrirUrgencia(): boolean {
    if (this.isAdmin || this.isReceptionist) {
      return true;
    }
    return false;
  }

  puedeAbrirAgendarCitas(): boolean {
    if (this.isAdmin || this.isReceptionist) {
      return true;
    }
    return false;
  }

  puedeAbrirAgendados(): boolean {
    if (this.isAdmin || this.isReceptionist) {
      return true;
    }
    return false;
  }

  puedeAbrirEnvioDeEstudios(): boolean {
    if (this.isAdmin || this.isReceptionist) {
      return true;
    }
    return false;
  }

  puedeAbrirVentaConceptos(): boolean {
    if (this.isAdmin || this.isTechnician) {
      return true;
    }
    return false;
  }

  puedeAbrirCampanias(): boolean {
    if (this.isAdmin) {
      return true;
    }
    return false;
  }

  puedeAbrirDictador(): boolean {
    if (this.isRadiologicPhysician) {
      return true;
    }
    return false;
  }

  puedeAbrirTabulador(): boolean {
    if (this.isAdmin) {
      return true;
    }
    return false;
  }

  puedeAbrirInstrucciones(): boolean {
    if (this.isAdmin) {
      return true;
    }
    return false;
  }

  puedeAbrirHorarios(): boolean {
    if (this.isAdmin) {
      return true;
    }
    return false;
  }

  puedeAbrirInstitucion(): boolean {
    if (this.isInstitution) {
      return true;
    }
    return false;
  }
  puedeAbrirSubirFotoOrden(): boolean {
    if (this.isAdmin || this.isReceptionist) {
      return true;
    }
    return false;
  }

  puedeAbrirCrudMedicos(): boolean {
    if (this.isReceptionist || this.isAdmin || this.isTechnician) {
      return true;
    }
    return false;
  }

  puedeAbrirMembresias(): boolean {
    if ((this.isReceptionist, this.isAdmin)) {
      return true;
    }
    return false;
  }

  puedeAbrirMedicosReferentes(): boolean {
    if (this.isReferring) {
      return true;
    }
    return false;
  }
  puedeAbrirPacientes(): boolean {
    if (this.isReceptionist || this.isAdmin) {
      return true;
    }
    return false;
  }
  puedeAbrirChat(): boolean {
    if (this.isReceptionist || this.isAdmin) {
      return true;
    }
    return false;
  }

  puedeAbrirCortes(): boolean {
    if (this.isReceptionist || this.isAdmin) {
      return true;
    }
    return false;
  }
  puedeAbrirTurnero(): boolean {
    if (this.isAdmin || this.isTurnero) {
      return true;
    }
    return false;
  }
  puedeAbrirRelacion(): boolean {
    if (this.username == 'scarrera') {
      return false;
    }
    if (this.isRadiologicPhysician || this.isAdmin) {
      return true;
    }
    return false;
  }

  public abrirPerfilModal():void{
    this.dialog.open(PerfilModalComponent, {
      width: '1024px',
      data: { user: this.username },
    });
  }
}
