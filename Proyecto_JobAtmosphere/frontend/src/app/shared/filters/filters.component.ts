import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Category } from 'src/app/core/models/category.model';
import { Job } from 'src/app/core/models/job.model';
import { Filters } from 'src/app/core/models/filters.model';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  @Input() listCategories: Category[] = [];
  @Output() eventofiltros: EventEmitter<Filters> = new EventEmitter();

  routeFilters: string | null = null;
  filters!: Filters;

  id_cat: string = '';
  salary_max: number | undefined;
  salary_min: number | undefined;

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private Router: Router,
    private Location: Location
  ) {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
  }

  ngOnInit(): void {
    this.ActivatedRoute.snapshot.paramMap.get('filters') != undefined ? this.Highlights() : "";
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
  }

  public filter_jobs() {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    // console.log(this.routeFilters);

    if (this.routeFilters != null) {
        this.filters = JSON.parse(atob(this.routeFilters));
        // console.log(this.filters.category);
    } else {
        this.filters = new Filters();
    }

    // Asignar los filtros si existen
    if (this.id_cat) this.filters.category = this.id_cat;
    if (this.salary_min != null) this.filters.salary_min = this.salary_min;
    if (this.salary_max != null && this.salary_max !== 0) this.filters.salary_max = this.salary_max;

    // Limpieza de valores `null` o `undefined` en el objeto `filters`
    this.filters = Object.keys(this.filters)
        .filter(key => this.filters[key] !== undefined && this.filters[key] !== null)
        .reduce((obj, key) => {
            obj[key] = this.filters[key];
            return obj;
        }, {} as Filters);

    // Actualizar la URL sin parámetros vacíos
    setTimeout(() => {
        const urlFilters = btoa(JSON.stringify(this.filters));
        this.Location.replaceState(`/shop/${urlFilters}`);
        this.eventofiltros.emit(this.filters);
    }, 200);
}

  public salary_calc(
    salary_min: number | undefined,
    salary_max: number | undefined
  ) {
    if (typeof salary_min == 'number' && typeof salary_max == 'number') {
      if (salary_min > salary_max) {
        this.salary_min = salary_min;
        this.salary_max = undefined;
      } else {
        this.salary_min = salary_min;
        this.salary_max = salary_max;
      }
    }
  }

  public remove_filters() {
    window.location.assign('http://localhost:4200/shop');
    this.filters.category && this.id_cat === '';
    this.filters.salary_min = undefined;
    this.filters.salary_max = undefined;
  }

  Highlights() {
    let routeFilters = JSON.parse(
      atob(this.ActivatedRoute.snapshot.paramMap.get('filters') || '')
    );

    if (routeFilters.search == undefined) {
      this.id_cat = routeFilters.category || '';
      this.salary_min = routeFilters.salary_min;
      this.salary_max = routeFilters.salary_max;
    }
  }
}