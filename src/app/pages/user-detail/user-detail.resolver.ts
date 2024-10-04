import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetUser } from 'src/app/store/user/user.actions';

@Injectable({
  providedIn: 'root'
})
export class UserDetailResolver implements Resolve<any> {

  constructor(private router: Router, private store: Store) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.params['id'];
    return this.store.dispatch(new GetUser(id)).pipe(
      map((user: any) => {
        if (user) {
          return user.users.selected;
        } else {
          this.router.navigate(['/not-found']);
          return {};
        }
      }),
      catchError((error: any) => {
        console.error(error);
        this.router.navigate(['/not-found']);
        return of({});
      })
    );
  }

}