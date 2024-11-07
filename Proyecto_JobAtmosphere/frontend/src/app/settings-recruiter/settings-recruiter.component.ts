import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Recruiter } from '../core/models/recruiter.model';
import { RecruiterService } from '../core/services/recruiter.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-settings-recruiter',
    templateUrl: './settings-recruiter.component.html',
    styleUrls: ['./settings-recruiter.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsRecruiterComponent implements OnInit {
    recruiter: Recruiter = {} as Recruiter;
    settingsForm: FormGroup;
    errors: Object = {};
    isSubmitting = false;

    constructor(
        private router: Router,
        private recruiterService: RecruiterService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        this.settingsForm = this.fb.group({
            location: '',
            image: '',
            n_employee: '',
            description: '',
        });
    }

    ngOnInit() {
        Object.assign(this.recruiter, this.recruiterService.getCurrentRecruiter());
        this.settingsForm.patchValue(this.recruiter);
    }

    logout() {
        this.recruiterService.logout().subscribe({
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

        console.log("Recruiter updated 1: ", this.settingsForm.value);
        const updateValues = this.settingsForm.value;
        updateValues.n_employee = parseInt(updateValues.n_employee);

        // this.recruiterService.update(updateValues).subscribe(
        //     (updatedRecruiter: Recruiter) => {
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Success',
        //             text: 'Settings successfully updated'
        //         }).then(() => {
        //             window.location.reload();
        //         });
        //     }
        // );
    }
}