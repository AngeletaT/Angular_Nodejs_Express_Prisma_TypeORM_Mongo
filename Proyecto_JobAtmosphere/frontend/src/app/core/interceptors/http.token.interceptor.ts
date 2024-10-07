import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/user.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': ''
    };

    const token = this.jwtService.getAccessToken();

    if (token) {
      headersConfig['Authorization'] = `Token ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });

    console.log('Request:', request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        console.log('Error:', error);

        if (error.status === 403) {
          // Token might be expired, try to refresh it
          return this.userService.refreshToken().pipe(
            switchMap((newTokens: { accessToken: string, refreshToken: string }) => {
              console.log('New Tokens:', newTokens);

              this.jwtService.saveAccessToken(newTokens.accessToken);
              this.jwtService.saveRefreshToken(newTokens.refreshToken);

              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Token ${newTokens.accessToken}`
                }
              });

              console.log('New Request:', newRequest);

              return next.handle(newRequest);
            }),
            catchError(err => {
              console.log('Refresh Token Error:', err);
              
              this.jwtService.destroyAccessToken();
              this.jwtService.destroyRefreshToken();
              return throwError(err);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}