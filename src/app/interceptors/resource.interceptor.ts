import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Injectable()
export class ResourceInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let intReq = request;
    const token =  this.tokenService.getAccessToken();
    if(token !=null ){
      intReq = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    return next.handle(intReq).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          this.router.navigateByUrl('/logout');
        }

        return throwError(err);

      })
    )
    ;
  }
}
