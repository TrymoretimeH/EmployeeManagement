import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tokenUtil } from '../../utils/token/token';
import { StorageService } from '../../services/storage/storage.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  const token = tokenUtil.getToken();
  if (token != null) {
    // const isExpired = tokenUtil.checkTokenExpiration(token);

    // test angular without api support
    return true;

    // if (!isExpired) {
    //   let roles = tokenUtil.getRoles(token);
    //   if (roles.includes("ADMIN")) {
    //     return true;
    //   }
    //   router.navigateByUrl("dashboard");
    //   return false;
    // } else {
    //   token.removeToken();
    //   router.navigateByUrl("/login");
    //   return false;
    // }
  } else {
    router.navigateByUrl("/login");
    return false;
  }
};
