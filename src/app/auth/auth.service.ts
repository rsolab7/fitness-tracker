/*
 * add event emitter for authservice to inform other parts of
 * the app about changes in the auth state.
 * Agular eventEmitter is only use for custom events emmited in components
 * -> user (rjxs) observables
 */
import {Subject} from 'rxjs/Subject';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from 'angularfire2/auth';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material';
import { UIService } from '../shared/ui-service';

@Injectable()
export class AuthService {
  // used to store user localy
  // private user: User;

  private isAuthenticated = false;
  authChanges = new Subject<boolean>();


  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  initAuthListener() {
    // Emit an event evertime the auth status changes.
    // Recieve a user that if not authenticated will be null.
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.gotoTraining();
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChanges.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // Local User creation
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    // this.gotoTraining();

    // Create user in db
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.uiService.loadingStateChanged.next(false);
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackBar(error.message, null, 3000);
    });
  }
  // By using signInWithEmailAndPassword Firebase is already storing the token
  // and sending it to the server
  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.uiService.loadingStateChanged.next(false);
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackBar(error.message, null, 3000);

    });
  }

  logout() {
    this.afAuth.auth.signOut();
    // this.user = null;

  }

  // no longer needed
  // getUser() {
  //   // return a new object using the object spread operator
  //   // prevents other classes to manipulate the data since is passed by reference
  //   return { ...this.user };
  // }

  isAuth() {
    return this.isAuthenticated;
  }

  private gotoTraining() {
    this.isAuthenticated = true;
    this.authChanges.next(true);
    this.router.navigate(['/training']);
  }
}
