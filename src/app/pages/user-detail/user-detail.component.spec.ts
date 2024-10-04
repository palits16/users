import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { User } from 'src/app/interface/user.interface';
import { UserState } from 'src/app/store/user/user.state';
import { UserDetailComponent } from './user-detail.component';
import { ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { USERS } from 'src/app/mock/mock-data';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let store: Store;
  let fixture: ComponentFixture<UserDetailComponent>;
  let subscription: any;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;


  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserState]),RouterTestingModule, HttpClientTestingModule],
      declarations: [UserDetailComponent],
      providers: [
        Store,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should navigate to /users if authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(of(true));

    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
    expect(locationSpy.back).not.toHaveBeenCalled();
  });

  it('should call location.back if not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(of(false));

    component.goBack();

    expect(locationSpy.back).not.toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select user from store', () => {
    const user: User = USERS[0];
    spyOn(store, 'select').and.returnValue(of(user));
    component.ngOnInit();
    expect(component.user).toBe(user);
  });

  it('should update user when store changes', () => {
    const user: User = USERS[0];
    const newUser: User = USERS[1];
    spyOn(store, 'select').and.returnValue(of(user));
    component.ngOnInit();
    expect(component.user).toBe(user);
    store.select = jasmine.createSpy('select').and.returnValue(of(newUser));
    component.ngOnInit();
    expect(component.user).toBe(newUser);
  });

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });
});
