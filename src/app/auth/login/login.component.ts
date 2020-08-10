import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
 
})
export class LoginComponent  {
loginForm = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
  
});
  constructor(private authSvc: AuthService, private router: Router) { }

 async onGoogleLogin(){
   try{
const user = await this.authSvc.loginGoogle();
if (user){
  this.checkUserIsVerified(user);
  this.router.navigateByUrl('/home');
}
}catch (error){
   console.log(error);
 }
 }

  async onLogin(){
  const {email, password} = this.loginForm.value;
  try{
    const user = await this.authSvc.login(email, password);
   this.checkUserIsVerified(user);
    }
  catch(error){
    console.log(error)
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
