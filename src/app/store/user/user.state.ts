import { State, Selector, Action, StateContext } from '@ngxs/store';
import { catchError, delayWhen, of, retryWhen, take, tap, timer } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ApplyFilter, GetUser, GetUsers } from './user.actions';
import { Injectable } from '@angular/core';
import { UserStateModel } from './user.model';
import { User } from 'src/app/interface/user.interface';
import { USERS } from 'src/app/mock/mock-data';

@State<UserStateModel>({
  name: 'users',
  defaults: {
    users: USERS,
    filteredUsers: USERS,
    selected: USERS[0],
    errors: undefined
  }
})
@Injectable()
export class UserState {
  constructor(private userService: UserService) {}

  @Selector()
  static getUsers(state: UserStateModel) {
    return state.users || state.errors;
  }

  @Selector()
  static getSelectedUser(state: UserStateModel) {
    return state.selected;
  }

  @Selector()
  static getErrors(state: UserStateModel) {
    return state.errors;
  }

  // @Action(GetUsers)
  // getUsers(ctx: StateContext<UserStateModel>) {
  //   return this.userService.getUsers().pipe(
  //     retryWhen(errors => errors.pipe(
  //       tap(error => alert('Error occured .. retrying to get users.')),
  //       delayWhen(() => timer(1000)),
  //       take(3)
  //     )),
  //     tap((users: any) => ctx.patchState({ users })),
  //     catchError((error: any) => {
  //       ctx.patchState({ errors: error.message });
  //       return of(null);
  //     })
  //   );
  // }

  @Action(ApplyFilter)
  applyFilter(ctx: StateContext<UserStateModel>, action: ApplyFilter) {
    const state: UserStateModel = ctx.getState();
    const filteredUsers = state.users.filter((user: User) =>
      user.name.toLowerCase().includes(action.payload.toLowerCase())
    );
    ctx.patchState({ filteredUsers });
  }

  @Action(GetUsers)
  getUsers(ctx: StateContext<UserStateModel>) {
    return this.userService.getUsers().pipe(
      retryWhen(errors => errors.pipe(
        tap(error => {
          const errorMessage: string = error.message || 'An error occurred while fetching users.';
          ctx.patchState({ errors: errorMessage }); // Update state with error message
          console.error('Error fetching users, retrying...', error)
        }),
        delayWhen(() => timer(1000)),
        take(3)
      )),
      tap((users: User[]) => {
        ctx.patchState({ users, errors: null }); // Clear errors on success
      })
    );
  }

  @Action(GetUser)
  getUser(ctx: StateContext<UserStateModel>, { id }: GetUser) {
    return this.userService.getUser(id).pipe(
      tap((user: User) => ctx.patchState({ selected: user }))
    );
  }
}

