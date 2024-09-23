import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// CATEGORIES
import { ListCategoriesComponent } from './list-categories/list-categories.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  declarations: [ListCategoriesComponent],
  exports: [FormsModule, ReactiveFormsModule, ListCategoriesComponent],
})
export class SharedModule {}
