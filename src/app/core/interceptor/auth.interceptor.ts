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

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      const tokenizedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Standard header format
        }
      });
      return next.handle(tokenizedReq);
    }

    return next.handle(request);
  }
}
