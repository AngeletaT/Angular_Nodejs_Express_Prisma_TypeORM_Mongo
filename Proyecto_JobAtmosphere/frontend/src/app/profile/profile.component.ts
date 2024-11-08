import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { JobService } from '../core/services/job.service';
import { User } from '../core/models/user.model';
import { Job } from '../core/models/job.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
    user: User = {} as User;
    profileForm: FormGroup;
    errors: Object = {};
    isSubmitting = false;
    currentView: string = 'profile';
    favoriteJobs: Job[] = [];

    constructor(
        private router: Router,
        private userService: UserService,
        private jobService: JobService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        this.profileForm = this.fb.group({
            image: '',
            username: '',
            bio: '',
            email: '',
            password: ''
        });
    }

    ngOnInit() {
        this.userService.getUserProfile().subscribe({
            next: (userProfile) => {
                // console.log(userProfile);
                this.user = userProfile;
                this.user.favoriteJobs = this.user.favoriteJobs || [];
                this.profileForm.patchValue(this.user);
                this.cd.detectChanges();
            },
            error: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load user profile. Please try again later.'
                });
            }
        });
    }

    showProfile() {
        this.currentView = 'profile';
    }

    showFavorites() {
        this.currentView = 'favorites';
    }

    showSettings() {
        this.currentView = 'settings';
    }

    isActive(view: string): boolean {
        return this.currentView === view;
    }

}