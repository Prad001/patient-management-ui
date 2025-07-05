// import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

// @Component({
//   selector: 'app-pagination',
//   templateUrl: './pagination.component.html',
//   styleUrls: ['./pagination.component.scss']
// })
// export class PaginationComponent {
//     @Input() totalItems:any;
//     @Input() currentPage:any;
//     @Input() itemsPerPage: any;
//     @Output() onClick: EventEmitter<number>= new EventEmitter();
//     @Input() totalPages : any;
//     //totalPages: number = 0;
//     pages: number[] = [];
//     constructor(){

//     }

//     ngOnChanges(changes: SimpleChanges): void {
//       if (changes['totalItems'] || changes['itemsPerPage']) {
//         //this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
//         this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
//       }
//     }
    

//     pageClicked(page: number){
//        if(page>this.totalPages) return;

//        this.onClick.emit(page)
//     }

  
// }

import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
    @Input() totalItems: number | any;
    @Input() currentPage: number | any;
    @Input() itemsPerPage: number | any;
    @Input() totalPages: number | any;
    @Output() onClick: EventEmitter<number> = new EventEmitter();
    
    pages: number[] = [];
    maxVisiblePages: number = 5;

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['totalPages'] || changes['currentPage']) {
        this.updatePageRange();
      }
    }

    // Update the displayed page range based on the current page
    updatePageRange() {
      const halfRange = Math.floor(this.maxVisiblePages / 2);
      let startPage = Math.max(1, this.currentPage - halfRange);
      let endPage = Math.min(this.totalPages, startPage + this.maxVisiblePages - 1);

      // Adjust startPage if we're at the end of the page list
      if (endPage - startPage + 1 < this.maxVisiblePages) {
        startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
      }

      this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }

    pageClicked(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.onClick.emit(page);
      }
    }

    goToFirstPage() {
      this.onClick.emit(1);
    }

    goToLastPage() {
      this.onClick.emit(this.totalPages);
    }
}

// "ag-grid-angular": "^32.3.3",
//     "ag-grid-community": "^32.3.3",

