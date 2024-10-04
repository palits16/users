import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ApplyFilter, GetUsers } from 'src/app/store/user/user.actions';
import { UserState } from 'src/app/store/user/user.state';
import { User, UserDatasource } from 'src/app/interface/user.interface';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  searchTerm = '';
  displayedColumns: string[] = ['name', 'email', 'phone'];
  dataSource: MatTableDataSource<UserDatasource>;
  filteredData: any;
  retryCount = 0;
  maxRetries = 3;
  loading = false;

  @Select(UserState.getUsers) users$: Observable<User[]>;
  @Select(UserState.getErrors) error$: Observable<string | null>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}

  applyFilter(filterValue: string): void {
    this.store.dispatch(new ApplyFilter(filterValue));
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToUserDetails(rowId: number): void {
    this.router.navigate(['/users', rowId]);
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.store.dispatch(new GetUsers());
    this.users$.subscribe((users: User[]) => {
        this.dataSource = new MatTableDataSource<UserDatasource>(users);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
    );
    this.error$.subscribe((error: string | null) => {
      if (error) {
        this.showError(error);
      }
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

}

