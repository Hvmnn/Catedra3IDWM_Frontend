import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const token = localStorage.getItem('jwt');

  if(token){
    return true;
  }

  const router = inject(Router);
  router.navigate(['/login'], {
    queryParams: {returnUrl: state.url},
  });

  return false;
};
