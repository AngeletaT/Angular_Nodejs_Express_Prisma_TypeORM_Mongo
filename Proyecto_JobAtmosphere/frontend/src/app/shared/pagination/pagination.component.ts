import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() jobs: any[] = [];
  @Input() totalPages: number[] = [];
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  visiblePages: number[] = [];

  ngOnChanges() {
    this.updateVisiblePages();
  }

  setPageTo(pageNumber: number) {
    if (pageNumber !== this.currentPage) {
      this.currentPage = pageNumber;
      this.pageChange.emit(this.currentPage);
      this.updateVisiblePages();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
      this.updateVisiblePages();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
      this.updateVisiblePages();
    }
  }

  updateVisiblePages() {
    const totalVisible = 3;
    const halfVisible = Math.floor(totalVisible / 2);

    let start = Math.max(this.currentPage - halfVisible, 1);
    let end = Math.min(start + totalVisible - 1, this.totalPages.length);

    if (end - start < totalVisible - 1) {
      start = Math.max(end - totalVisible + 1, 1);
    }

    this.visiblePages = [];
    for (let i = start; i <= end; i++) {
      this.visiblePages.push(i);
    }
  }
}