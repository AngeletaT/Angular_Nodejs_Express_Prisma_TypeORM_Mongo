import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getAccessToken(): string {
    return window.localStorage['accessToken'];
  }

  saveAccessToken(token: string) {
    window.localStorage['accessToken'] = token;
  }

  destroyAccessToken() {
    window.localStorage.removeItem('accessToken');
  }

  getRefreshToken(): string {
    return window.localStorage['refreshToken'];
  }

  saveRefreshToken(token: string) {
    window.localStorage['refreshToken'] = token;
  }

  destroyRefreshToken() {
    window.localStorage.removeItem('refreshToken');
  }
}