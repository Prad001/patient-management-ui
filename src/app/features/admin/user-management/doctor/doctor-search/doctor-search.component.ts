import { ChangeDetectorRef, Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { Header } from 'src/types/header';
import { DeleteDialogComponent } from '../../../shared/dialogs/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatService } from '../../../shared/service/time-format.service';
import { Doctor } from 'src/types/doctor';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-search',
  templateUrl: './doctor-search.component.html',
  styleUrls: ['./doctor-search.component.scss']
})
export class DoctorSearchComponent {
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
  doctors: Doctor[] = [];
  filteredData: Doctor[] = [];
  searchedData: Doctor[] = [];

  // ─── UI Configuration ─────────────────────────────────────────
  headers: Header[] = [
    {
      name: "Doctor Id",
      property: "doctorId",
      showInDropdown: true,

    },
    {
      name: "Doctor Name",
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
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private timeFormatService: TimeFormatService
  ) { }

  // ──────────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.fetchDoctors();

    this.searchTextChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text) => {
        this.searchText = text;
        this.searchDoctors();
      });

    this.cdr.detectChanges();
  }

  // ──────────────────────────────────────────────────────────────
  // Getters
  // ──────────────────────────────────────────────────────────────
  get paginatedData(): Doctor[] {
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
    this.inSearchMode ? this.fetchDoctorsSearch() : this.fetchDoctors();
  }

  onSearchTextChange(searchValue: string): void {
    this.searchTextChanged.next(searchValue);
  }


  handleAction(event: {
    action: string;
    rowIndex: number;
    rowData: Doctor;
  }): void {
    if (event.action === "update") {
      this.updateDoctor(event.rowIndex);
    } else if (event.action === "delete") {
      this.deleteDoctor(event.rowIndex);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────────────────────
  updateDoctor(index: number): void {
    const doctorId = this.inSearchMode
      ? this.searchedData[index].doctorId
      : this.filteredData[index].doctorId;
    this.router.navigate([
      "admin/user-management/doctor/update",
      doctorId,
    ]);
  }

  createDoctors(): void {
    this.router.navigate([
      "admin/user-management/doctor/create",
    ]);
  }

  back(): void {
    if (this.inSearchMode) {
      this.inSearchMode = false;
      this.fetchDoctors();
    } else {
      this.router.navigate(["admin/user-management/doctor/search"]);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Data Fetching
  // ──────────────────────────────────────────────────────────────
  async fetchDoctors(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.doctorService.getDoctors(this.currentPage - 1, this.itemsPerPage)
      );
      this.formatAndSetDoctors(response, false);
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  }

  async fetchDoctorsSearch(): Promise<void> {
    try {
      const response = await this.doctorService
        .getDoctorSearch(
          this.currentPage - 1,
          this.filterByHeader,
          this.searchText,
          this.itemsPerPage
        )
        .toPromise();

      this.formatAndSetDoctors(response, true);
    } catch (error) {
      console.error("Error fetching rule search:", error);
    }
  }


  private formatAndSetDoctors(response: any, inSearchMode: boolean): void {
    if (!response || !response.content || response.content.length === 0) return;

    const formatted = response.content.map((doctor: Doctor) => ({
      ...doctor,
      timestamp: this.timeFormatService.formatDate(doctor.updatedAt),
    }));

    if (inSearchMode) {
      this.searchedData = formatted;
      this.totalPagesSearch = response.totalPages;
    } else {
      this.filteredData = formatted;
      this.totalPagesNormal = response.totalPages;
    }

    this.totalPages = response.totalPages;
    this.currentPage = response.page + 1;
  }

  // private updatePagination(response: Doctor[] | undefined): void {
  //   if (response && response.length > 0 && response[0].totalPages) {
  //     const totalPages = response[0].totalPages;
  //     const currentPage = response[0].currentPage + 1;

  //     if (this.inSearchMode) {
  //       this.totalPagesSearch = totalPages;
  //     } else {
  //       this.totalPagesNormal = totalPages;
  //     }

  //     this.totalPages = totalPages;
  //     this.currentPage = currentPage;
  //   }
  // }


  // ──────────────────────────────────────────────────────────────
  // Search
  // ──────────────────────────────────────────────────────────────
  async searchDoctors(): Promise<void> {
    try {
      if (this.searchText && this.filterByHeader) {
        this.inSearchMode = true;
        await this.fetchDoctorsSearch();
        this.totalPages = this.totalPagesSearch;
      } else {
        this.inSearchMode = false;
        await this.fetchDoctors();
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Delete
  // ──────────────────────────────────────────────────────────────
  async deleteDoctor(index: number): Promise<void> {
    try {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Are you sure?",
          message: "Do you really want to delete this Doctor?",
          isConfirm: false,
        },
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

      const doctorId = this.inSearchMode
        ? this.searchedData[index].doctorId
        : this.filteredData[index].doctorId;

      await firstValueFrom(this.doctorService.deleteDoctor(doctorId));

      // ✅ Wait for data to reload before showing success message
      if (this.inSearchMode) {
        await this.fetchDoctorsSearch();
      } else {
        await this.fetchDoctors();
      }

      this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Success",
          message: "The doctor has been deleted successfully.",
          isConfirm: true,
        },
      });

    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  }
}
