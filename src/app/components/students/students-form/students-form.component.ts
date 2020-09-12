import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { StudentsService } from '../../../services/students.service';
import { AuthService } from 'src/app/services/auth.service';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import {AngularFireStorage} from "@angular/fire/storage";

@Component({
  selector: 'app-students-form',
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss']
})
export class StudentsFormComponent implements OnInit {
  public students: any = [];
  public currentUser;
  public searchText = '';

  constructor(public studentsService: StudentsService,private storage: AngularFireStorage,public dialogRef: MatDialogRef<StudentsFormComponent>) { }
  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('productImage') inputProductImage: ElementRef;

  ngOnInit(): void {

  }
  onSaveProduct(formStudent: NgForm):void{
    //new
    if (formStudent.value.id == null){
      formStudent.value.id= Math.random().toString(36).substring(2);
      this.studentsService.createStudent(formStudent.value);
    } else {
      //update
      this.studentsService.updateStudent(formStudent.value);
    }
    formStudent.reset();
    this.onClose(formStudent);
  }

  onClose(formStudent:NgForm): void {
    formStudent.reset();
    this.dialogRef.close();
  }



}
