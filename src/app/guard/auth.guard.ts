import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);


  const token = localStorage.getItem("token");
  if (token != null) {
    const isExpired = checkTokenExpiration(token);
    if (!isExpired) {
      return true;
    } else {
      localStorage.removeItem("token");
      router.navigateByUrl("login");
      return false;
    }

  } else {
    router.navigateByUrl("login");
    return false;
  }
};

function checkTokenExpiration(token: string): boolean {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp;
  const now = Math.floor(Date.now() / 1000);

  return exp < now;
}
