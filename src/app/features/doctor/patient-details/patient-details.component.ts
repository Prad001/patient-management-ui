import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { Patient } from 'src/types/patient';
import { Header } from 'src/types/header';
import { PatientService } from '../../admin/user-management/patient/patient.service';
import { TimeFormatService } from '../shared/service/time-format.service';
import { DeleteDialogComponent } from '../shared/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent {

  // Pagination 
  currentPage = 1;
  itemsPerPage = 7;
  totalPages = 0;
  totalPagesNormal = 0;
  totalPagesSearch = 0;

  // Search & Filtering
  searchText: string = '';
  filterByHeader: string = '';
  inSearchMode = false;
  searchTextChanged = new Subject<string>();

  // data
  patients: Patient[] = [];
  filteredData: Patient[] = [];
  searchedData: Patient[] = [];

  headers: Header[] = [
    { name: "Patient Id", property: "patientId", showInDropdown: true },
    { name: "Patient Name", property: "name", showInDropdown: true },
    { name: "Gender", property: "gender", showInDropdown: true },
  ];

  constructor(
    private router: Router,
    private patientService: PatientService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private timeFormatService: TimeFormatService
  ) { }

  buttonConfig = {
    update: true,
    delete: true,
    capture: false,
  };

  async ngOnInit(): Promise<void> {
    await this.fetchPatients();

    this.searchTextChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text) => {
        this.searchText = text;
        this.searchPatients();
      });

    this.cdr.detectChanges();
  }
  get paginatedData(): Patient[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.inSearchMode
      ? this.searchedData.slice(start, end)
      : this.filteredData.slice(start, end);
  }

  onSearchTextChange(searchValue: string): void {
    this.searchTextChanged.next(searchValue);
  }

  createPatients(): void {
    this.router.navigate(["admin/user-management/patient/create"]);
  }

  handleAction(event: {
    action: string;
    rowIndex: number;
    rowData: Patient;
  }): void {
    if (event.action === "update") {
      this.updatePatient(event.rowIndex);
    } else if (event.action === "delete") {
      this.deletePatient(event.rowIndex);
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.inSearchMode ? this.fetchPatientsSearch() : this.fetchPatients();
  }


  async fetchPatients(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.patientService.getPatients(this.currentPage - 1)
      );
      this.formatAndSetPatients(response, false)
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }

  async fetchPatientsSearch(): Promise<void> {
    try {
      const page = isNaN(this.currentPage) || this.currentPage < 1 ? 0 : this.currentPage - 1;

      if (!this.filterByHeader) {
        console.warn("No filter header selected");
        return;
      }

      const response = await this.patientService
        .getPatientSearch(
          page,
          this.filterByHeader,
          this.searchText,
          this.itemsPerPage
        )
        .toPromise();

      console.log("Search Page:", this.currentPage, "Sending page:", page);
      console.log("Search Filter:", this.filterByHeader, "Search Text:", this.searchText);

      this.formatAndSetPatients(response, true);
    } catch (error) {
      console.error("Error fetching patient search:", error);
    }
  }

  async searchPatients(): Promise<void> {
    try {
      if (this.searchText && this.filterByHeader) {
        this.inSearchMode = true;
        await this.fetchPatientsSearch();
        this.totalPages = this.totalPagesSearch;

        const selectedHeader = this.headers.find(
          (h) => h.property === this.filterByHeader && h.showInDropdown
        );

        if (selectedHeader) {
          this.searchedData = this.searchedData.filter((patient) => {
            const value = patient[selectedHeader.property];
            return value
              ?.toString()
              .toLowerCase()
              .includes(this.searchText.toLowerCase());
          });

          this.searchedData.sort((a, b) =>
            a[selectedHeader.property]?.toString()
              .localeCompare(b[selectedHeader.property])
          );
        } else {
          this.filteredData = [];
        }
      } else {
        this.inSearchMode = false;
        await this.fetchPatients();
      }
    } catch (error) {
      console.error("Error during patient search:", error);
    }
  }

  updatePatient(index: number): void {
    const patientId = this.inSearchMode
      ? this.searchedData[index].patientId
      : this.filteredData[index].patientId;

    this.router.navigate(["admin", "user-management", "patient", "update", patientId]);
  }

  async deletePatient(index: number): Promise<void> {
    try {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Are you sure?",
          message: "Do you really want to delete this Patient?",
          isConfirm: false,
        },
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

      const patientId = this.inSearchMode
        ? this.searchedData[index].patientId
        : this.filteredData[index].patientId;
      await firstValueFrom(this.patientService.deletePatient(patientId));

      this.inSearchMode ? this.fetchPatientsSearch() : this.fetchPatients();

      this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Success",
          message: "The Patient has been deleted successfully.",
          isConfirm: true,
        },
      });
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  }

  private formatAndSetPatients(
    response: { content: Patient[]; totalPages: number; number: number },
    inSearchMode: boolean
  ): void {
    if (!response || !Array.isArray(response.content)) return;

    const formatted = response.content.map((patient) => ({
      ...patient,
      timestamp: this.timeFormatService.formatDate(patient.updatedAt),
    }));

    if (inSearchMode) {
      this.searchedData = formatted;
      this.totalPagesSearch = response.totalPages;
    } else {
      this.filteredData = formatted;
      this.totalPagesNormal = response.totalPages;
    }

    this.updatePagination(response);
  }

  private updatePagination(response: { totalPages: number; number: number }): void {
    this.totalPages = response.totalPages;
    this.currentPage = response.number + 1; // backend is 0-based, UI is 1-based
  }
}
