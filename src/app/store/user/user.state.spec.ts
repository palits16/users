import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UserState } from './user.state';
import { GetUsers } from './user.actions';
import { User } from 'src/app/interface/user.interface';
import { USERS } from 'src/app/mock/mock-data';

describe('UserState', () => {
  let store: Store;
  let userService: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = USERS;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('User Service', ['getUsers', 'getUser ']);

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserState])],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    });

    store = TestBed.inject(Store);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create an instance of the state', () => {
    expect(store.selectSnapshot(UserState.getUsers)).toEqual(USERS);
    expect(store.selectSnapshot(UserState.getSelectedUser)).toEqual(USERS[0]);
  });

  describe('GetUsers action', () => {
    it('should populate users on success', () => {
      userService.getUsers.and.returnValue(of(mockUsers));

      store.dispatch(new GetUsers());

      const users = store.selectSnapshot(UserState.getUsers);
      expect(users).toEqual(mockUsers);
      expect(userService.getUsers).toHaveBeenCalled();
    });

    it('should handle errors', () => {
        const errorMessage = 'Failed to load users';
        userService.getUsers.and.returnValue(
          throwError(() => new Error(errorMessage))
        );
      
        store.dispatch(new GetUsers());
      
        const users = store.selectSnapshot(UserState.getUsers);
        expect(users).toEqual(USERS);
      });
  });

  describe('GetUser  action', () => {
    it('should populate users on success', () => {
        userService.getUsers.and.returnValue(of(mockUsers));
  
        store.dispatch(new GetUsers());
  
        const users = store.selectSnapshot(UserState.getUsers);
        expect(users).toEqual(mockUsers);
        expect(userService.getUsers).toHaveBeenCalled();
      });
  });
});
