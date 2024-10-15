import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.model';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-settings-user',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
    user: User = {} as User;
    settingsForm: FormGroup;
    errors: Object = {};
    isSubmitting = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        this.settingsForm = this.fb.group({
            image: '',
            username: '',
            bio: '',
            email: '',
            password: ''
        });
    }

    ngOnInit() {
        Object.assign(this.user, this.userService.getCurrentUser());
        this.settingsForm.patchValue(this.user);
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
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Logout failed',
                    text: 'Please try again later.'
                });
            }
        });
    }

    submitForm() {
        this.isSubmitting = true;

        this.updateUser(this.settingsForm.value);

        this.userService.update(this.user).subscribe(
            updatedUser => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Settings successfully updated'
                }).then(() => {
                    this.router.navigateByUrl('/home');
                });
            }

        );
    }

    updateUser(values: Object) {
        Object.assign(this.user, values);
    }

}