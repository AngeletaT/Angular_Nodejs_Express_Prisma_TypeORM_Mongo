import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

// import { User, UserService } from '../../../core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  bars: Boolean = false;

  constructor(
    // private userService: UserService,
    // private cd: ChangeDetectorRef,
    // private router: Router
  ) {}

//   currentUser: User;

  ngOnInit() {
    // this.userService.currentUser.subscribe(
    //   (userData) => {
    //     this.currentUser = userData;
    //     this.cd.markForCheck();
    //   }
    // );
  }

//   logout() {
//     this.userService.purgeAuth();
//     this.router.navigateByUrl('/');
//   }

//   nav_bars() {
//     if (this.bars == false) {
//       this.bars = true;
//     } else {
//       this.bars = false;
//     }
//   }

}