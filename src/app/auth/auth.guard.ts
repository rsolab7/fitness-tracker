import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import {take} from 'rxjs/operators';

// Normal ts class
@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor (private store: Store<fromRoot.State>, private router: Router) {}
  // first arg -> route we are trying to activate || second arg ->  current router state
  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    // }
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canLoad (route: Route) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

}
