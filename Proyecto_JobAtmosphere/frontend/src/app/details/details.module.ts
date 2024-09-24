import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsComponent } from './details.component';
import { DetailsRoutingModule } from './details-routing.module';

import { SharedModule } from '../shared';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DetailsRoutingModule, 
    ],
    declarations: [
        DetailsComponent
    ],
    providers: [
    ],
})

export class DetailsModule { }