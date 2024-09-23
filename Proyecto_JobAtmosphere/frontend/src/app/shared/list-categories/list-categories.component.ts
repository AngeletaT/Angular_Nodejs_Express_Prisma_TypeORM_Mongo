import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service'
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent implements OnInit {
  
  // offset = 0;
  // limit = 4;
  categories: Category[] = [];

  constructor(private CategoryService: CategoryService) { }

  //INICIA 

  ngOnInit(): void {
    this.getCategories();
  }

  // TOTES LES CATEGORIES
  getCategories() {
    // const params = this.getRequestParams();
    
    this.CategoryService.all_categories().subscribe(
      (data: any) => {
        this.categories = data.categories;
        // this.limit = this.limit + 4;
        console.log(this.categories);      
      }
    );
  }

  // getRequestParams(offset: number,limit: number): any{
  //   let params: any = {};

  //   params[`offset`] = offset;
  //   params[`limit`] = limit;

  //   return params;
  // }

  scroll() {
    this.getCategories();
  }
}