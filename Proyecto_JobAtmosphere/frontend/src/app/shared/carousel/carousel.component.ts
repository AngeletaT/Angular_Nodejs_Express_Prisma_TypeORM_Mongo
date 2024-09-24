import { Component, OnInit, Input} from '@angular/core';
import { CarouselDetails, CarouselHome } from 'src/app/core/models/carousel.model';
import { Category } from 'src/app/core/models/category.model';
import { CarouselService } from 'src/app/core/services/carousel.service';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../core/services/job.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})

export class CarouselComponent implements OnInit {

  items_carousel!: CarouselHome[];
  items_details!: CarouselDetails[];
  slug_details!: string | null;
  page!: String;

  constructor(private CarouselService: CarouselService, private jobService: JobService, private ActivatedRoute: ActivatedRoute,) {}

  ngOnInit(): void {
    this.slug_details = this.ActivatedRoute.snapshot.paramMap.get('slug');
    this.carousel_categories();
    this.carousel_shop_details();
  }

  carousel_categories(): void {
    this.page = "categories";
    this.CarouselService.getCarouselHome().subscribe(((data : any) => {
      // console.log(data);
      this.items_carousel = data.categories;
  })) 
  }
  carousel_shop_details(): void {
    if(this.slug_details){
      this.page = "details";
      this.CarouselService.getCarouselDetails(this.slug_details).subscribe(((data : any) => {
        // console.log(data);
        this.items_details = data.jobs.images;
        // console.log(this.items_details);
    })) 
    }
  }
}