import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsCompanyComponent } from './details-company.component';
import { DetailsCompanyRoutingModule } from './details-company-routing.module';
import { SharedModule } from '../shared';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DetailsCompanyRoutingModule
    ],
    declarations: [
        DetailsCompanyComponent
    ],
    providers: [
    ],
})

export class DetailsCompanyModule { }