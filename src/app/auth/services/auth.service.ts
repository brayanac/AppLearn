import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/shared/models/user.interface';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from  '@angular/fire/firestore';
import { RoleValidator } from '../helpers/roleValidator';

@Injectable({ providedIn: 'root' })

export class AuthService  extends RoleValidator{

public user$:Observable<User>

constructor(public afAuth: AngularFireAuth,
            private afs: AngularFirestore) {
    super();
    this.user$ = this.afAuth.authState.pipe(
    switchMap((user) => {
      if (user){
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges;
      }
      return of(null);
    })
  );
 }

async loginGoogle(): Promise<User> {
  try{
    const { user } =  await this.afAuth.signInWithPopup(
      new auth.GoogleAuthProvider()
      );
      this.updateUserData(user);
      return user;
   } catch(error){
      console.log(error)
    }
}

async resetPassword(email: string): Promise<void>{
  try{
    return this.afAuth.sendPasswordResetEmail(email);
  }catch(error){
    console.log(error);
  } 
}
  
async sendVerificationEmail(): Promise<void>{
  try{
    return await (await this.afAuth.currentUser).sendEmailVerification();
  }catch(error){
    console.log(error);
  }
}

  async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(
        email, 
        password
        );
        this.updateUserData(user)
        return user;
    }
    catch(error){
      console.log(error);
    }
   
  
  }

    async register(email: string, password: string): Promise<User> {
      try{
      const { user } = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      this.sendVerificationEmail();
      return user;
    }
    catch(error){
      console.log(error);
    }
  }
    
    async logout(): Promise<void>{
      try{
      await this.afAuth.signOut();
    }
    catch(error){
      console.log(error);
    }
    }


    private updateUserData(user:User){
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(
        `users/${user.uid}`
      );

      const data: User = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'EDITOR'
      };
      return userRef.set(data, {merge: true});
    }
}