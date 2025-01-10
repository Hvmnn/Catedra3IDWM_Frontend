import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const token = localStorage.getItem('jwt');

  if(token){
    return true;
  }

  const router = inject(Router);
  alert('Debe iniciar sesión para acceder a esta página');
  router.navigate(['/login'], {
    queryParams: {returnUrl: state.url},
  });

  return false;
};
