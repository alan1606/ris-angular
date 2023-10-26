import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, retry, switchMap, take, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ResourceInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token =  this.tokenService.getAccessToken();
    if(token !=null){
      request = this.addToken(request, token);
    }
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401Error(request, next);
        }
        else {
          return this.handleGenericError(err);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    // Verificar si el token de acceso ha expirado
    if (!this.isRefreshing && this.tokenService.isAccessTokenExpired()) {
      // El token de acceso ha expirado, verificamos el refresh token
      const refreshToken = this.tokenService.getRefreshToken();

      if (!refreshToken || this.tokenService.isRefreshTokenExpired()) {
        // Si no hay un refresh token o el refresh token también ha expirado,
        // redirigimos al usuario a la página de cierre de sesión.
        this.tokenService.logOut();
        this.router.navigate(['/']);
        return throwError("Token expirado. Usuario desconectado.");
      }
  
      // Si llegamos aquí, significa que el refresh token aún es válido,
      // así que intentamos actualizar el token de acceso.
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      console.log("refrescando token");

      return this.authService.refreshToken().pipe(
        retry(3),
        switchMap(({ access_token, refresh_token }) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(access_token);
          this.tokenService.setTokens(access_token, refresh_token);
          return next.handle(this.addToken(request, access_token));
        }),
        catchError((err: any) => {
          this.isRefreshing = false;
          console.log(err);
          //this.tokenService.logOut();
          //this.router.navigate(['/']);
          return throwError("Error al actualizar el token");
        })
      );
  
    } else {
      // Si el token de acceso no ha expirado o ya estamos actualizando el token,
      // continuamos con la solicitud original con el token actual.
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }


  private handleGenericError(error: HttpErrorResponse) {
    // Manejar cualquier otro error aquí de manera genérica
    // Puedes redirigir a una página de error, mostrar un mensaje, etc.
    console.error('Error occurred:', error);
    // Por ejemplo, redirigir a una página de error
    // this.router.navigate(['/error']);
    return throwError('Ocurrió un error. Por favor, inténtelo de nuevo más tarde.');
  }

}
