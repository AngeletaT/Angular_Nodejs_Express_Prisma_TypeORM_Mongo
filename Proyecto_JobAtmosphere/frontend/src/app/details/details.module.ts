import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { DetailsRoutingModule } from './details-routing.module';
import { FormCommentComponent } from './form-comment/form-comment.component';
import { ListCommentComponent } from './list-comment/list-comment.component';
import { SharedModule } from '../shared';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DetailsRoutingModule,
    ],
    declarations: [
        DetailsComponent,
        FormCommentComponent,
        ListCommentComponent,
    ],
    providers: [
    ],
})

export class DetailsModule { }