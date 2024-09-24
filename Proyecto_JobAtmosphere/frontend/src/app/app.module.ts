import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FooterComponent, HeaderComponent, SharedModule } from './shared';
import { CarouselModule} from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [AppComponent, FooterComponent, HeaderComponent],
  imports: [SharedModule, BrowserModule, AppRoutingModule, NgbModule, CarouselModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
