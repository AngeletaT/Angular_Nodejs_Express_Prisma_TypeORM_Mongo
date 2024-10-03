import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Errors } from '../core/models/errors.model';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  authType: string = '';
  title: String = '';
  errors: Errors = {errors: {}};
  isSubmitting = false;
  authForm: FormGroup;
  user! : any ;
  // errors: User = {errors: {}};


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private user: UserService,
    private userService: UserService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a title for the page accordingly
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
      // add form control for username if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl());
      }
      this.cd.markForCheck();
    });
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = {errors: {}};
    this.user = this.authForm.value ;
    // this.user ={} ;
    // console.log(this.user);
    this.userService.attemptAuth(this.authType, this.user).subscribe(
      (data: any) => {
        this.router.navigateByUrl('/')
    } 
      // err => {
      //   this.errors = err;
      //   this.isSubmitting = false;
      //   this.cd.markForCheck();
      // }
    );
  }
}