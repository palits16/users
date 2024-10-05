import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { USERS } from '../mock/mock-data';
import { User } from '../interface/user.interface';

describe('User Service', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  // Constants for repeated strings
  const apiUrl: string = 'https://jsonplaceholder.typicode.com/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve users from the API via GET', () => {
    const mockUsers: User[] = USERS;

    service.getUsers().subscribe((users: User[]) => {
      expect(users.length).toBe(10);
      expect(users).toEqual(mockUsers);
    });

    const req: TestRequest = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should retrieve a user by ID from the API via GET', () => {
    const mockUser: User = USERS[0];

    service.getUser('1').subscribe((user: User) => {
      expect(user).toEqual(mockUser);
    });

    const req: TestRequest = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should handle errors when retrieving users', () => {
    service.getUsers().subscribe(
      () => fail('Expected an error, not users'),
      (error: any) => {
        expect(error.status).toBe(500);
      }
    );

    const req: TestRequest = httpMock.expectOne(apiUrl);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});