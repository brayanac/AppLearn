import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { take, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanAdminGuard implements CanActivate {
  
  constructor(private authSvc: AuthService){}
  
  
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authSvc.user$.pipe( 
      take(1),
      map((user) => user && this.authSvc.isAdmin(user)),
      tap ( canEdit => {
        if ( !canEdit){
          window.alert('Access denied. Must have permission to manage data.')
        }
      })
    )
  }
  
}
