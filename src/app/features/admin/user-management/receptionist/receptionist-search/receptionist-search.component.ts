import { ChangeDetectorRef, Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Header } from 'src/types/header';
import { Receptionist} from 'src/types/receptionist';
import { DeleteDialogComponent } from '../../../shared/dialogs/delete-dialog/delete-dialog.component';
import { ReceptionistService } from '../receptionist.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatService } from '../../../shared/service/time-format.service';

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
    this.totalPages = this.inSearchMode
      ? this.totalPagesSearch
      : this.totalPagesNormal;
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
    const ruleId = this.inSearchMode
      ? this.searchedData[index].receptionistId
      : this.filteredData[index].receptionistId;
    this.router.navigate([
      "ada-access/auth-tools/policy-authoring/rules/update",
      ruleId,
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
      const response = await this.receptionistService
        .getReceptionists(this.currentPage - 1)
        .toPromise();
      this.formatAndSetRules(response, false);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  }

  async fetchRecpetionistsSearch(): Promise<void> {
    try {
      const response = await this.receptionistService
        .getReceptionistSearch(
          this.currentPage - 1,
          this.searchText,
          this.filterByHeader
        )
        .toPromise();
      this.formatAndSetRules(response, true);
    } catch (error) {
      console.error("Error fetching rule search:", error);
    }
  }

private formatAndSetRules(response: Receptionist[] | undefined, inSearchMode: boolean): void {
  if (!response || response.length === 0) return;

  const formatted = response.map((rule) => ({
    ...rule,
    timestamp: this.timeFormatService.formatDate(rule.updatedAt),
  }));

  if (inSearchMode) {
    this.searchedData = formatted;
    this.totalPagesSearch = response[0]?.totalPages || 0;
  } else {
    this.filteredData = formatted;
    this.totalPagesNormal = response[0]?.totalPages || 0;
  }

  this.updatePagination(response);
}


 private updatePagination(response: Receptionist[] | undefined): void {
  if (response && response.length > 0 && response[0].totalPages) {
    const totalPages = response[0].totalPages;
    const currentPage = response[0].currentPage + 1;

    if (this.inSearchMode) {
      this.totalPagesSearch = totalPages;
    } else {
      this.totalPagesNormal = totalPages;
    }

    this.totalPages = totalPages;
    this.currentPage = currentPage;
  }
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
          message: "Do you really want to delete this Rule?",
          isConfirm: false,
        },
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

      // const ruleId = this.inSearchMode
      //   ? this.searchedData[index].ruleId
      //   : this.filteredData[index].ruleId;
      // await this.receptionistService.deleteRule(ruleId).toPromise();

      this.inSearchMode ? this.fetchRecpetionistsSearch() : this.fetchRecpetionists();

      this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Success",
          message: "The Rule has been deleted successfully.",
          isConfirm: true,
        },
      });
    } catch (error) {
      console.error("Error deleting Rule:", error);
    }
  }
}
