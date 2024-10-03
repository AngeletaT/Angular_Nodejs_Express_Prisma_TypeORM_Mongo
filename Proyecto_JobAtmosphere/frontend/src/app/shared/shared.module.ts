import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// CATEGORIES
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { CardCategoryComponent } from './card-category/card-category.component';

// JOBS
import { ListJobsComponent } from '../shared/list-jobs/list-jobs.component';
import { CardJobComponent } from '../shared/card-job/card-job.component';

// SHARED
import { CarouselItemsComponent } from './carousel-items/carousel-items.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent } from './carousel/carousel.component';
import { FiltersComponent } from './filters/filters.component';
import { SearchComponent } from './search/search.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ShowAuthedDirective } from './show-authed.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    InfiniteScrollModule,
  ],
  declarations: [
    ListCategoriesComponent,
    ListJobsComponent,
    CardCategoryComponent,
    CardJobComponent,
    CarouselItemsComponent,
    CarouselComponent,
    FiltersComponent,
    SearchComponent,
    PaginationComponent,
    ShowAuthedDirective,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ListCategoriesComponent,
    ListJobsComponent,
    CardCategoryComponent,
    CardJobComponent,
    CarouselItemsComponent,
    CarouselComponent,
    FiltersComponent,
    SearchComponent,
    PaginationComponent,
    ShowAuthedDirective,
  ],
})
export class SharedModule {}
