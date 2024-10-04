import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { User } from 'src/app/interface/user.interface';
import { UserState } from 'src/app/store/user/user.state';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User;

  constructor(private router: Router, private authService: AuthService,private store: Store, private location: Location) { }

  ngOnInit(): void {
    this.store.select(UserState.getSelectedUser).subscribe((user: User) => {
      this.user = user;
    });
  }

  goBack(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/users']);
    } else {
      this.location.back();
    }
  }

}
