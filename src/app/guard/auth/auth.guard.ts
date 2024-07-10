import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tokenUtil } from '../../utils/token/token';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);


  const token = localStorage.getItem("token");
  if (token != null) {
    const isExpired = checkTokenExpiration(token);
    const jsonPayload = getTokenPayload(token);
    if (!isExpired) {
      let roles = tokenUtil.getRoles(token)
      if (roles.includes("ADMIN") || roles.includes("USER")) {
        return true;
      }
      
      router.navigateByUrl("dashboard")
      return false;
    } else {
      tokenUtil.removeToken();
      router.navigateByUrl("/login");
      return false;
    }

  } else {
    router.navigateByUrl("/login");
    return false;
  }
};

function checkTokenExpiration(token: string): boolean {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp;
  const now = Math.floor(Date.now() / 1000);

  return exp < now;
}

function getTokenPayload(token: string): string {
  const payload = JSON.parse(atob(token.split(".")[1]));

  return payload
}