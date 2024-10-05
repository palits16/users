import { TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/services/user.service';
import { Store } from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';
import { UserState } from 'src/app/store/user/user.state';
import { UserListComponent } from './user-list.component';
import { of } from 'rxjs';
import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { User, UserDatasource } from 'src/app/interface/user.interface';
import { USERS } from 'src/app/mock/mock-data';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplyFilter } from 'src/app/store/user/user.actions';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: any;
  let router: any;
  let store: any;
  let paginator: any;
  let storeSpy: jasmine.SpyObj<Store>;


  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['getUsers']);
    store = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    paginator = jasmine.createSpyObj('MatPaginator', ['']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        RouterTestingModule.withRoutes([]),
        NgxsModule.forRoot([UserState]),
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      declarations: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Store, useValue: store },
        { provide: MatPaginator, useValue: paginator },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    component.dataSource = new MatTableDataSource<UserDatasource>(USERS);
  });

  it('should dispatch ApplyFilter action with correct filter value', () => {
    const filterValue: string = 'test';
    component.applyFilter(filterValue);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(new ApplyFilter(filterValue));
  });

  it('should set dataSource filter correctly', () => {
    const filterValue: string = 'Test Filter';
    component.applyFilter(filterValue);

    expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply filter', () => {
    const filterValue: string= 'test';
    component.applyFilter(filterValue);
    expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
  });

  it('should navigate to user details', () => {
    const rowId: number = 1;
    router.navigate.and.callThrough();
    component.navigateToUserDetails(rowId);
    expect(router.navigate).toHaveBeenCalledWith(['/users', rowId]);
  });

  it('should trackby function', () => {
    const index: number = 0;
    const item: any = { id: 1 };
    expect(component.trackByFn(index, item)).toBe(item.id);
  });

  it('should load users', () => {
    const users: User[] = USERS;
    store.select.and.returnValue(of(users));
    component.loadUsers();
    expect(component.dataSource.data).toBe(users);
  });
});
