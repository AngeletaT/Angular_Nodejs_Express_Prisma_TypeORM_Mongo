import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { CompanyDashboardComponent } from './company-dashboard.component';
import { CompanyDashboardRoutingModule } from './company-dashboard-routing.module';
import { SettingsCompanyComponent } from '../settings-company/settings-company.component';

@NgModule({
    imports: [
        SharedModule,
        CompanyDashboardRoutingModule,
        CommonModule
    ],
    declarations: [
        CompanyDashboardComponent,
        SettingsCompanyComponent
    ]
})
export class CompanyDashboardModule { }
