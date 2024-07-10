import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tokenUtil } from '../../utils/token/token';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  const token = tokenUtil.getToken();
  if (token != null) {
    const isExpired = tokenUtil.checkTokenExpiration(token);
    if (!isExpired) {
      let roles = tokenUtil.getRoles(token);
      if (roles.includes("ADMIN")) {
        return true;
      }
      router.navigateByUrl("dashboard");
      return false;
    } else {
      token.removeToken();
      router.navigateByUrl("/login");
      return false;
    }
  } else {
    router.navigateByUrl("/login");
    return false;
  }
};
