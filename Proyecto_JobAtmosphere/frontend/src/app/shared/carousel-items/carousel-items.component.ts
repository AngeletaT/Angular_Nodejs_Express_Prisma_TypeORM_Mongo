import { Component, Input, OnInit } from '@angular/core';
import { CarouselDetails, CarouselHome } from 'src/app/core/models/carousel.model';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../core/models/category.model'


@Component({
  selector: 'app-carousel-items',
  templateUrl: './carousel-items.component.html',
  styleUrls: ['./carousel-items.component.css']
})

export class CarouselItemsComponent implements OnInit {


  @Input() categories!: CarouselHome[];
  @Input() jobs_details!: CarouselDetails[];
  @Input() page!: String;
  

  selectIndex = 0;
  selectIndex_job_img = 0;

  constructor(){}
  ngOnInit(): void {
  }
}