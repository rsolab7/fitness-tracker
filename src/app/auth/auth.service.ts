/*
 * add event emitter for authservice to inform other parts of
 * the app about changes in the auth state.
 * Agular eventEmitter is only use for custom events emmited in components
 * -> user (rjxs) observables
 */
import {Subject} from 'rxjs/Subject';
import { User } from './user.model';
import { AuthData } from './auth-data.model';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private user: User;
  authChanges = new Subject<boolean>();


  constructor(private router: Router) {}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.gotoTraining();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.gotoTraining();
  }

  logout() {
    this.user = null;
    this.authChanges.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    // return a new object using the object spread operator
    // prevents other classes to manipulate the data since is passed by reference
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }

  private gotoTraining() {
    this.authChanges.next(true);
    this.router.navigate(['/training']);
  }
}
