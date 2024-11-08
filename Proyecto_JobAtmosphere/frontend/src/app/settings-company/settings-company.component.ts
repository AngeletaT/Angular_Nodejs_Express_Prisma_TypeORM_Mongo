import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Company } from '../core/models/company.model';
import { CompanyService } from '../core/services/company.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-settings-company',
    templateUrl: './settings-company.component.html',
    styleUrls: ['./settings-company.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsCompanyComponent implements OnInit {
    company: Company = {} as Company;
    settingsForm: FormGroup;
    errors: Object = {};
    isSubmitting = false;

    constructor(
        private router: Router,
        private companyService: CompanyService,
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
        Object.assign(this.company, this.companyService.getCurrentCompany());
        this.settingsForm.patchValue(this.company);
    }

    logout() {
        this.companyService.logout().subscribe({
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

        // console.log("Company updated 1: ", this.settingsForm.value);
        const updateValues = this.settingsForm.value;
        updateValues.n_employee = parseInt(updateValues.n_employee);

        this.companyService.update(updateValues).subscribe(
            (updatedCompany: Company) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Settings successfully updated'
                }).then(() => {
                    window.location.reload();
                });
            }
        );
    }
}