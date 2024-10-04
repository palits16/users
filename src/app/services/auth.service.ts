import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth-token';
  private username: string = 'admin';
  private password: string = 'admin';

  login(username: string, password: string): Observable<boolean> {
    if (username === this.username && password === this.password) {
      const token = Math.random().toString(36).substr(2, 10);
      localStorage.setItem(this.tokenKey, token);
      return of(true);
    } else {
      return of(false);
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): Observable<boolean> {
    const token: string | null = localStorage.getItem(this.tokenKey);
    if (token !== null && token !== undefined && token !== '') {
      return of(true);
    } else {
      return of(false);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

}