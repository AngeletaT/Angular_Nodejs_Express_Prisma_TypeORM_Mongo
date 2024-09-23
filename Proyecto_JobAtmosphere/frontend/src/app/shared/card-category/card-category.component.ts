import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-card-category',
  templateUrl: './card-category.component.html',
  styleUrls: ['./card-category.component.css'],
})
export class CardCategoryComponent {
  @Input() category: Category = {} as Category;

  constructor() {}

  ngOnInit(): void {}
}
