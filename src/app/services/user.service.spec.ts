import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

// Define interfaces for type safety
interface User {
  id: number;
  name: string;
}

describe('User Service', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  // Constants for repeated strings
  const apiUrl = 'https://jsonplaceholder.typicode.com/users';

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
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ];

    service.getUsers().subscribe((users: User[]) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should retrieve a user by ID from the API via GET', () => {
    const mockUser: User = { id: 1, name: 'John Doe' };

    service.getUser ('1').subscribe((user: User) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
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

    const req = httpMock.expectOne(apiUrl);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});