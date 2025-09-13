import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
   auth_token="3erfhjohweorhjwehfweoijofgqwhfsdfwed234y823fhu2397t9vb89i43yr383"
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokenizedReq= request.clone({
       setHeaders:{
        authToken: `${this.auth_token}`
       }
    })
    return next.handle(tokenizedReq);
  }
}
