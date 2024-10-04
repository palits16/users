import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.returnUrl = params['returnUrl'];
    });
    this.loginForm = new FormGroup({
      username: new FormControl('admin', Validators.required),
      password: new FormControl('admin', Validators.required)
    });
  }

  onSubmit(): void {
    const username: string = this.loginForm?.get('username')?.value;
    const password: string = this.loginForm?.get('password')?.value;

    this.authService.login(username, password).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated && this.returnUrl && this.returnUrl.trim() !== '') {
        const decodedUrl: string = decodeURIComponent(this.returnUrl);
        this.router.navigate([decodedUrl]);
      } else {
        alert('Invalid username or password');
      }
    });
  }
}