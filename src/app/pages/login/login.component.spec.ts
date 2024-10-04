import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from './login.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const authServiceSpy: any = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ returnUrl: '/dashboard' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm with default values', () => {
    expect(component.loginForm.get('username')?.value).toBe('admin');
    expect(component.loginForm.get('password')?.value).toBe('admin');
  });

  it('should navigate to returnUrl on successful login', () => {
    authService.login.and.returnValue(of(true));
    spyOn(router, 'navigate');
    spyOn(console, 'log');

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('admin', 'admin');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });


  it('should alert on unsuccessful login', () => {
    authService.login.and.returnValue(of(false));
    spyOn(window, 'alert');
    component.returnUrl = '';
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('admin', 'admin');
    expect(window.alert).toHaveBeenCalledWith('Invalid username or password');
  });

});