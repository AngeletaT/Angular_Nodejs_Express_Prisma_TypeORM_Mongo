import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../shared';
import { ProfileRoutingModule } from './profile-routing.module';
import { SettingsComponent } from '../settings/settings.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        SharedModule,
        ProfileRoutingModule,
        CommonModule
    ],
    declarations: [
        ProfileComponent,
        SettingsComponent
    ]
})
export class ProfileModule { }