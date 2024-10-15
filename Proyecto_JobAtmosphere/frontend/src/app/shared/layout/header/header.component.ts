import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { ShowAuthedDirective } from '../../../shared/show-authed.directive';
import Swal from 'sweetalert2';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  bars: Boolean = false;
  logged!: Boolean;
  profile: string = '/profile';

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  currentUser!: User;

  ngOnInit() {
    this.userService.isAuthenticated.subscribe(
      (data) => {
        this.logged = data;
        // this.cd.markForCheck();
      }
    );
    this.userService.currentUser.subscribe(
      (userData) => {
        // console.log(userData);
        this.currentUser = userData;
        // console.log(this.currentUser);

        this.cd.markForCheck();
      }
    );
  }

  logout() {
    this.userService.logout().subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Logged out successfully',
          text: 'See you soon!'
        }).then(() => {
          this.router.navigateByUrl('/');
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Logout failed',
          text: 'Please try again later.'
        });
      }
    });
  }

  nav_bars() {
    if (this.bars == false) {
      this.bars = true;
    } else {
      this.bars = false;
    }
  }
}