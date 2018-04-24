import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth$: Observable <boolean>;
  authSubscription: Subscription;

  constructor(private authService: AuthService, private store: Store <{ui: fromRoot.State}>) { }

  ngOnInit() {
    // this.authSubscription = this.authService.authChanges.subscribe(authStatus => {
    //   this.isAuth = authStatus;
    // });
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }
  onLogout() {
    this.onClick();
    this.authService.logout();
  }
  onClick() {
    this.closeSidenav.emit();
  }


}
