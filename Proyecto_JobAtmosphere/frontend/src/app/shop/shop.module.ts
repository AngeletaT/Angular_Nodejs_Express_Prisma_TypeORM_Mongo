import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopRoutingModule } from './shop-routing.module';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [ShopComponent],
  imports: [CommonModule, ShopRoutingModule, SharedModule],
})
export class ShopModule {}
