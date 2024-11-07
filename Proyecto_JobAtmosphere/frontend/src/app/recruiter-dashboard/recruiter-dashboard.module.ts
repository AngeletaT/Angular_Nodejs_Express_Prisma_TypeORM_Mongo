import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { RecruiterDashboardComponent } from './recruiter-dashboard.component';
import { RecruiterDashboardRoutingModule } from './recruiter-dashboard-routing.module';
import { SettingsRecruiterComponent } from '../settings-recruiter/settings-recruiter.component';

@NgModule({
    imports: [
        SharedModule,
        RecruiterDashboardRoutingModule,
        CommonModule
    ],
    declarations: [
        RecruiterDashboardComponent,
        SettingsRecruiterComponent
    ]
})
export class RecruiterDashboardModule { }
