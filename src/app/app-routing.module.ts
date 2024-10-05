import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailGuard } from './pages/user-detail/user-detail.guard';
import { UserDetailResolver } from './pages/user-detail/user-detail.resolver';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'users/:id',
    loadChildren: () => import('./pages/user-detail/user-detail.module').then(m => m.UserDetailModule),
    canActivate: [UserDetailGuard],
    resolve: {
      user: UserDetailResolver
    }
  },
  {
    path: '**',
    redirectTo: 'users',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}