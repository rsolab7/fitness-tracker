import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { UIService } from '../../shared/ui-service';
// tslint:disable-next-line:import-blacklist
import {Subscription, Observable} from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { map } from 'rxjs/operators';

@Component ({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading$: Observable<boolean>;
  // private loadingSubs: Subscription;

  // It will be the same instance of AuthService due to
  // We provided it in the app modules
  constructor(private authService: AuthService, private uiService: UIService, private store: Store<{ui: fromRoot.State}>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
}

  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    });
    console.log(this.authService);
  }

  // ngOnDestroy() {
  //   if (this.loadingSubs) {
  //     this.loadingSubs.unsubscribe();
  //   }
  // }
}
