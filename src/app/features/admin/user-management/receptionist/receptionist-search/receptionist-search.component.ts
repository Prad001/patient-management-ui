import { ChangeDetectorRef, Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { Header } from 'src/types/header';
import { Receptionist } from 'src/types/receptionist';
import { DeleteDialogComponent } from '../../../shared/dialogs/delete-dialog/delete-dialog.component';
import { ReceptionistService } from '../receptionist.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatService } from '../../../shared/service/time-format.service';
import { SuccessDialogComponent } from '../../../shared/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-receptionist-search',
  templateUrl: './receptionist-search.component.html',
  styleUrls: ['./receptionist-search.component.scss']
})
export class ReceptionistSearchComponent {
    // ─── Pagination ───────────────────────────────────────────────
  currentPage = 1;
  itemsPerPage = 7;
  totalPages = 0;
  totalPagesNormal = 0;
  totalPagesSearch = 0;


  // ─── Search & Filtering ──────────────────────────────────────
  searchText: string = '';
  filterByHeader: string = '';
  inSearchMode = false;
  searchTextChanged = new Subject<string>();

  // ─── Data ─────────────────────────────────────────────────────
  receptionists: Receptionist[] = [];
  filteredData: Receptionist[] = [];
  searchedData: Receptionist[] = [];

  // ─── UI Configuration ─────────────────────────────────────────
  headers: Header[] = [
    {
      name: "Receptionist Id",
      property: "receptionistId",
      showInDropdown: true,
     
    },
    {
      name: "Receptionist Name",
      property: "name",
      showInDropdown: true,
      
    },
    {
      name: "Gender",
      property: "gender",
      showInDropdown: true,
      
    },
   
  ];

  buttonConfig = {
    update: true,
    delete: true,
    capture: false,
  };

  constructor(
    private router: Router,
    private receptionistService:ReceptionistService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private timeFormatService: TimeFormatService
  ) {}

  // ──────────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.fetchRecpetionists();

    this.searchTextChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text) => {
        this.searchText = text;
        this.searchReceptionists();
      });

    this.cdr.detectChanges();
  }

  // ──────────────────────────────────────────────────────────────
  // Getters
  // ──────────────────────────────────────────────────────────────
  get paginatedData(): Receptionist[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.inSearchMode
      ? this.searchedData.slice(start, end)
      : this.filteredData.slice(start, end);
  }

  // ──────────────────────────────────────────────────────────────
  // Event Handlers
  // ──────────────────────────────────────────────────────────────
changePage(page: number): void {
  this.currentPage = page;
  this.inSearchMode ? this.fetchRecpetionistsSearch() : this.fetchRecpetionists();
}

onSearchTextChange(searchValue: string): void {
  this.searchTextChanged.next(searchValue);
}


  handleAction(event: {
    action: string;
    rowIndex: number;
    rowData: Receptionist;
  }): void {
    if (event.action === "update") {
      this.updateRule(event.rowIndex);
    } else if (event.action === "delete") {
      this.deleteRule(event.rowIndex);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────────────────────
  updateRule(index: number): void {
    const receptionistId = this.inSearchMode
      ? this.searchedData[index].receptionistId
      : this.filteredData[index].receptionistId;
    this.router.navigate([
      "admin/user-management/receptionist/update",
      receptionistId,
    ]);
  }

  createReceptionists(): void {
    this.router.navigate([
      "admin/user-management/receptionist/create",
    ]);
  }

  back(): void {
    if (this.inSearchMode) {
      this.inSearchMode = false;
      this.fetchRecpetionists();
    } else {
      this.router.navigate(["ada-access/auth-tools/policy-authoring"]);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Data Fetching
  // ──────────────────────────────────────────────────────────────


async fetchRecpetionists(): Promise<void> {
  try {
    const response = await firstValueFrom(
      this.receptionistService.getReceptionists(this.currentPage - 1, this.itemsPerPage)
    );
    console.log("Response in search component", response);
    this.formatAndSetRecpetionists(response, false);
  } catch (error) {
    console.error("Error fetching receptionists:", error);
  }
}


  async fetchRecpetionistsSearch(): Promise<void> {
    try {
    const response = await firstValueFrom(
      this.receptionistService.getReceptionistSearch(
          this.currentPage - 1,
          this.searchText,
          this.filterByHeader,
          this.itemsPerPage
        )
        
    );
      this.formatAndSetRecpetionists(response, true);
    } catch (error) {
      console.error("Error fetching rule search:", error);
    }
  }

// private formatAndSetRecpetionists(response: Receptionist[] | undefined, inSearchMode: boolean): void {
//    if (!response || response.length === 0) return;
//   const formatted = response.map((rule) => ({
//     ...rule,
//     timestamp: this.timeFormatService.formatDate(rule.updatedAt),
//   }));

//   if (inSearchMode) {
//     this.searchedData = formatted;
//     this.totalPagesSearch = response[0]?.totalPages || 0;
//   } else {
//     this.filteredData = formatted;
//     console.log("filtered data is",this.filteredData);
//     this.totalPagesNormal = response[0]?.totalPages || 0;
//   }

//   this.updatePagination(response);
// }

private formatAndSetRecpetionists(response: any, inSearchMode: boolean): void {

   // if (!response || !response.content || response.content.length === 0) return;

  const content = response?.content;
  if (!content || content.length === 0) return;
  

  const formatted = content.map((receptionist: Receptionist) => ({
    ...receptionist,
    timestamp: this.timeFormatService.formatDate(receptionist.updatedAt),
  }));

  if (inSearchMode) {
    this.searchedData = formatted;
    this.totalPagesSearch = response.totalPages;
  } else {
    this.filteredData = formatted;
    this.totalPagesNormal = response.totalPages;
    console.log("Total pages normal:", this.totalPagesNormal);
  }

   this.totalPages = response.totalPages;
   this.currentPage = response.page + 1; // Adjusting for 0-based index
}

  // ──────────────────────────────────────────────────────────────
  // Search
  // ──────────────────────────────────────────────────────────────
  async searchReceptionists(): Promise<void> {
    try {
      if (this.searchText) {
        this.inSearchMode = true;

        await this.fetchRecpetionistsSearch();
        this.totalPages = this.totalPagesSearch;

        const selectedHeader = this.headers.find(
          (h) => h.property === this.filterByHeader && h.showInDropdown
        );
        if (selectedHeader) {
          this.searchedData = this.searchedData.filter((rule) => {
            const value = rule[selectedHeader.property];
            return value
              ?.toString()
              .toLowerCase()
              .includes(this.searchText.toLowerCase());
          });

          this.searchedData.sort((a, b) =>
            a[selectedHeader.property]
              ?.toString()
              .localeCompare(b[selectedHeader.property]?.toString())
          );
        } else {
          this.filteredData = [];
        }
      } else {
        this.inSearchMode = false;

        await this.fetchRecpetionists();
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Delete
  // ──────────────────────────────────────────────────────────────
  async deleteRule(index: number): Promise<void> {
    try {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Are you sure?",
          message: "Do you really want to delete this User?",
          isConfirm: false,
        },
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

     
       await this.receptionistService.deleteReceptionist(this.filteredData[index].receptionistId).subscribe(() => {});

     

      this.dialog.open(SuccessDialogComponent, {
        data: {
          title: "Success",
          message: "The User has been deleted successfully.",
          isConfirm: true,
        },
      }) .afterClosed()
      .subscribe(() => {
         this.inSearchMode ? this.fetchRecpetionistsSearch() : this.fetchRecpetionists();
      });
    } catch (error) {
      console.error("Error deleting User:", error);
    }
  }
}
