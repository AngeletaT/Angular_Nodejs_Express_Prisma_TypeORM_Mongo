import { Component, Input, OnInit } from '@angular/core';
import {
  CarouselDetails,
  CarouselHome,
} from 'src/app/core/models/carousel.model';

@Component({
  selector: 'app-carousel-items',
  templateUrl: './carousel-items.component.html',
  styleUrls: ['./carousel-items.component.css'],
})
export class CarouselItemsComponent implements OnInit {
  @Input() categories!: CarouselHome[];
  @Input() jobs_details!: CarouselDetails[];
  @Input() page!: string;

  constructor() {}
  ngOnInit(): void {}
}
