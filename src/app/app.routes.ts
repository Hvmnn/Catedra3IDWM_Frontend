import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';
import { ListComponent } from './auth/components/list/list.component';
import { authGuard } from './auth/guards/auth.guard';
import { CreateComponent } from './auth/components/create/create.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'posts', component: ListComponent, canActivate: [authGuard] },
  { path: 'posts/create', component: CreateComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
