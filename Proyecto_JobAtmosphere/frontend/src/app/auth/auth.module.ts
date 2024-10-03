import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { NoAuthGuard } from '../core/guards/no-auth-guard.service';
import { SharedModule } from '../shared';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AuthComponent
  ],
  providers: [
    NoAuthGuard
  ]
})
export class AuthModule {}