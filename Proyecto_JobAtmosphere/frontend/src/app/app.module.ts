import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent, HeaderComponent, SharedModule } from './shared';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AuthModule } from './auth/auth.module';
import { ShowAuthedDirective } from '../app/shared/show-authed.directive';
import { CoreModule } from './core/core.module';
import { ProfileModule } from './profile/profile.module';
import { CommonModule } from '@angular/common';
import { CompanyDashboardModule } from './company-dashboard/company-dashboard.module';
import { RecruiterDashboardModule } from './recruiter-dashboard/recruiter-dashboard.module';

@NgModule({
  declarations: [AppComponent, FooterComponent, HeaderComponent],
  imports: [
    SharedModule,
    NgbModule,
    BrowserModule,
    CarouselModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    CoreModule,
    ProfileModule,
    CommonModule,
    CompanyDashboardModule,
    RecruiterDashboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
