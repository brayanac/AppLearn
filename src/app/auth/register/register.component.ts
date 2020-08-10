import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.interface';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],

})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async onRegister() {
    const{ email, password } = this.registerForm.value;
    try {
    const user = await this.authSvc.register(email, password);
    
this.checkUserIsVerified(user);      
  } catch(error) {
    console.log(error);
  }
}

private checkUserIsVerified(user: User){
  if (user && user.emailVerified){
    this.router.navigateByUrl('/home');
  }else if (user){
    this.router.navigateByUrl('/verification-email');
  } else {
    this.router.navigateByUrl('/register');
  }
}

}
