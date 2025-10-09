import { ChangeDetectorRef, Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { Header } from 'src/types/header';
import { DeleteDialogComponent } from '../../shared/dialogs/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatService } from '../../shared/service/time-format.service';
import { Appointment } from 'src/types/appointment';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-past-appointments',
  templateUrl: './past-appointments.component.html',
  styleUrls: ['./past-appointments.component.scss']
})
export class PastAppointmentsComponent {
  currentPage = 1;
  itemsPerPage = 2;
  totalPages = 0;
  totalPagesNormal = 0;
  totalPagesSearch = 0;


  // ─── Search & Filtering ──────────────────────────────────────
  searchText: string = '';
  filterByHeader: string = '';
  inSearchMode = false;
  searchTextChanged = new Subject<string>();

  // ─── Data ─────────────────────────────────────────────────────
  appointments: Appointment[] = [];
  filteredData: Appointment[] = [];
  searchedData: Appointment[] = [];

  // ─── UI Configuration ─────────────────────────────────────────
  headers: Header[] = [
    {
      name: 'Doctor Name',
      property: 'doctorName',
      showInDropdown: false
    },
    {
      name: 'Patient Name',
      property: 'patientName',
      showInDropdown: false
    },
    {
      name: 'Slot Name',
      property: 'slotName',
      showInDropdown: false
    },
    {
      name: 'Appointment Date',
      property: 'appointmentDate',
      showInDropdown: true
    },
    {
      name: 'Appointment Time',
      property: 'appointmentTime',
      showInDropdown: true
    },
    {
      name: 'Status',
      property: 'appointmentStatus',
      showInDropdown: true
    },
  ];

  buttonConfig = {
    update: true,
    delete: true,
    capture: false,
  };

  constructor(
    private router: Router,
    private patientService: PatientService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private timeFormatService: TimeFormatService
  ) { }

  // ──────────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.fetchPastAppointments();

    this.searchTextChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text) => {
        this.searchText = text;
        this.searchPastAppointments();
      });

    this.cdr.detectChanges();
  }

  // ──────────────────────────────────────────────────────────────
  // Getters
  // ──────────────────────────────────────────────────────────────
  get paginatedData(): Appointment[] {
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
    this.inSearchMode ? this.fetchPastAppointmentsSearch() : this.fetchPastAppointments();
  }

  onSearchTextChange(searchValue: string): void {
    this.searchTextChanged.next(searchValue);
  }

  // ──────────────────────────────────────────────────────────────
  // Data Fetching
  // ──────────────────────────────────────────────────────────────
  async fetchPastAppointments(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.patientService.getPastAppointments(this.currentPage - 1, this.itemsPerPage)
      );
      this.formatAndSetPastAppointments(response, false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  async fetchPastAppointmentsSearch(): Promise<void> {
    try {
      const response = await this.patientService
        .getPastAppointmentSearch(
          this.currentPage - 1,
          this.filterByHeader,
          this.searchText,
          this.itemsPerPage
        )
        .toPromise();

      this.formatAndSetPastAppointments(response, true);
    } catch (error) {
      console.error("Error searching appointments:", error);
    }
  }

  private formatAndSetPastAppointments(response: any, inSearchMode: boolean): void {
    if (!response || !response.content || response.content.length === 0) return;

    const formatted = response.content.map((appointment: Appointment) => ({
      ...appointment,
      timestamp: this.timeFormatService.formatDate(appointment.updatedAt),
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


  // ──────────────────────────────────────────────────────────────
  // Search
  // ──────────────────────────────────────────────────────────────
  async searchPastAppointments(): Promise<void> {
    try {
      if (this.searchText && this.filterByHeader) {
        this.inSearchMode = true;
        await this.fetchPastAppointmentsSearch();
        this.totalPages = this.totalPagesSearch;
      } else {
        this.inSearchMode = false;
        await this.fetchPastAppointments();
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  }
}
