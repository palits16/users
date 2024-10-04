import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return true and set token for valid credentials', () => {
      service.login('admin', 'admin').subscribe(isAuthenticated => {
        expect(isAuthenticated).toBeTrue();
        expect(localStorage.getItem('auth-token')).toBeTruthy();
      });
    });

    it('should return false for invalid credentials', () => {
      service.login('user', 'wrongpassword').subscribe(isAuthenticated => {
        expect(isAuthenticated).toBeFalse();
        expect(localStorage.getItem('auth-token')).toBeNull();
      });
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('auth-token', 'dummy-token');
      service.logout();
      expect(localStorage.getItem('auth-token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('auth-token', 'dummy-token');
      service.isAuthenticated().subscribe(isAuthenticated => {
        expect(isAuthenticated).toBeTrue();
      });
    });

    it('should return false if token does not exist', () => {
      service.isAuthenticated().subscribe(isAuthenticated => {
        expect(isAuthenticated).toBeFalse();
      });
    });
  });

  describe('getToken', () => {
    it('should return token if it exists', () => {
      localStorage.setItem('auth-token', 'dummy-token');
      expect(service.getToken()).toBe('dummy-token');
    });

    it('should return null if token does not exist', () => {
      expect(service.getToken()).toBeNull();
    });
  });
});