import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// CATEGORIES
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { CardCategoryComponent } from './card-category/card-category.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  declarations: [ListCategoriesComponent, CardCategoryComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ListCategoriesComponent,
    CardCategoryComponent,
  ],
})
export class SharedModule {}
