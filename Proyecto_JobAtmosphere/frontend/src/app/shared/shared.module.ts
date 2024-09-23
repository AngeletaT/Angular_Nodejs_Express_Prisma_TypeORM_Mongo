import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// CATEGORIES
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { CardCategoryComponent } from './card-category/card-category.component';

//JOBS
import { ListJobsComponent } from '../shared/list-jobs/list-jobs.component';
import { CardJobComponent } from '../shared/card-job/card-job.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  declarations: [
    ListCategoriesComponent,
    ListJobsComponent,
    CardCategoryComponent,
    CardJobComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ListCategoriesComponent,
    ListJobsComponent,
    CardCategoryComponent,
    CardJobComponent,
  ],
})
export class SharedModule {}
