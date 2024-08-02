import { Inject, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tokenUtil } from '../../utils/token/token';
import { StorageService } from '../../services/storage/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  


  
  const storageService = new StorageService();

  const isLoggedIn = storageService.isLoggedIn();

  // const token = localStorage.getItem("token");
  if (isLoggedIn) {
    // const isExpired = checkTokenExpiration(token);
    // const jsonPayload = getTokenPayload(token);
    
    // test angular without api support
    return true;
    
    // if (!isExpired) {
    //   let roles = tokenUtil.getRoles(token)
    //   if (roles.includes("ADMIN") || roles.includes("USER")) {
    //     return true;
    //   }
      
    //   router.navigateByUrl("dashboard")
    //   return false;
    // } else {
    //   tokenUtil.removeToken();
    //   router.navigateByUrl("/login");
    //   return false;
    // }

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