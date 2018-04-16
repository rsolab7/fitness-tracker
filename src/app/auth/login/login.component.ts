import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // It will be the same instance of AuthService due to
  // we provided it in the app module
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    });
    console.log(this.authService);
  }
}
