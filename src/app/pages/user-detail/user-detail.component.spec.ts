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

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let store: Store;
  let fixture: ComponentFixture<UserDetailComponent>;
  let subscription: any;
  let locationSpy: jasmine.SpyObj<Location>;



  beforeEach(async () => {
    const locationMock = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserState]), HttpClientTestingModule],
      declarations: [UserDetailComponent],
      providers: [
        Store,
        { provide: Location, useValue: locationSpy }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should call location.back when goBack is called', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
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
