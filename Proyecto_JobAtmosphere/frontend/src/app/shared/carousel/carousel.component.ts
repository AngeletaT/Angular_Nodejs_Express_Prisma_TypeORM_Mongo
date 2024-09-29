import { Component, OnInit, Input } from '@angular/core';
import {
  CarouselDetails,
  CarouselHome,
} from 'src/app/core/models/carousel.model';
import { CarouselService } from 'src/app/core/services/carousel.service';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../core/services/job.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit {
  @Input() page!: string;
  items_carousel!: CarouselHome[];
  items_details!: CarouselDetails[];
  slug_details!: string | null;

  constructor(
    private carouselService: CarouselService,
    private jobService: JobService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.slug_details = this.activatedRoute.snapshot.paramMap.get('slug');
    this.loadCarouselItems();
  }

  loadCarouselItems(): void {
    if (this.page === 'home') {
      this.carousel_categories();
    } else if (this.page === 'details' && this.slug_details) {
      this.carousel_shop_details();
    }
  }

  carousel_categories(): void {
    this.carouselService.getCarouselHome().subscribe((data: any) => {
      this.items_carousel = data.categories;
    });
  }

  carousel_shop_details(): void {
    this.carouselService
      .getCarouselDetails(this.slug_details)
      .subscribe((data: any) => {
        this.items_details = data.jobs.images;
      });
  }
}
