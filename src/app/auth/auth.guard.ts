import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

// Normal ts class
@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private authService: AuthService, private router: Router) {}
  // first arg -> route we are trying to activate || second arg ->  current router state
  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }
}