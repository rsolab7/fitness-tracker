import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChanges.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }
  onLogout() {
    this.onClick();
    this.authService.logout();
  }
  onClick() {
    this.closeSidenav.emit();
  }
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
