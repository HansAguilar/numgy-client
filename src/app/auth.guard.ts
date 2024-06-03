import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.loggedIn && route.routeConfig?.path !== "/") {
    return true;
  }

  else {
    router.navigate(["/"])
    return false;
  }
};