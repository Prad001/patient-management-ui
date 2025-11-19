import { ChangeDetectorRef, Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { Header } from 'src/types/header';
import { DeleteDialogComponent } from '../../shared/dialogs/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatService } from '../../shared/service/time-format.service';
import { Appointment } from 'src/types/appointment';
import { AppointmentService } from '../appointment-service';
import { AuthService } from 'src/app/shared/auth-service/auth.service';

@Component({
  selector: 'app-appointment-search',
  templateUrl: './appointment-search.component.html',
  styleUrls: ['./appointment-search.component.scss']
})
export class AppointmentSearchComponent {
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
  doctorId = this.authService.getUserId();

  // ─── UI Configuration ─────────────────────────────────────────
  headers: Header[] = [
    {
      name: 'Appointment ID',
      property: 'appointmentId',
      showInDropdown: false
    },
    {
      name: 'Doctor ID',
      property: 'doctorId',
      showInDropdown: true
    },
    {
      name: 'Doctor Name',
      property: 'doctorName',
      showInDropdown: false
    },
    {
      name: 'Patient ID',
      property: 'patientId',
      showInDropdown: false
    },
    {
      name: 'Patient Name',
      property: 'patientName',
      showInDropdown: false
    },
    {
      name: 'Slot ID',
      property: 'slotId',
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
    {
      name: 'Created At',
      property: 'createdAt',
      showInDropdown: false
    },
    {
      name: 'Updated At',
      property: 'updatedAt',
      showInDropdown: false
    }
  ];

  buttonConfig = {
    update: true,
    delete: true,
    capture: false,
  };

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private timeFormatService: TimeFormatService,
    private authService: AuthService
  ) { }

  // ──────────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.fetchAppointments();

    this.searchTextChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text) => {
        this.searchText = text;
        this.searchAppointments();
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
    this.inSearchMode ? this.fetchAppointmentsSearch() : this.fetchAppointments();
  }

  onSearchTextChange(searchValue: string): void {
    this.searchTextChanged.next(searchValue);
  }


  handleAction(event: {
    action: string;
    rowIndex: number;
    rowData: Appointment;
  }): void {
    if (event.action === "update") {
      this.updateAppointment(event.rowIndex);
    } else if (event.action === "delete") {
      this.deleteAppointment(event.rowIndex);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────────────────────
  updateAppointment(index: number): void {
    const appointmentId = this.inSearchMode
      ? this.searchedData[index].doctorId
      : this.filteredData[index].doctorId;
    this.router.navigate([
      "doctor/appointment/update",
      appointmentId,
    ]);
  }

  createAppointments(): void {
    this.router.navigate([
      "doctor/appointment/create",
    ]);
  }

  back(): void {
    if (this.inSearchMode) {
      this.inSearchMode = false;
      this.fetchAppointments();
    } else {
      this.router.navigate(["doctor/appointment/search"]);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Data Fetching
  // ──────────────────────────────────────────────────────────────
  async fetchAppointments(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.appointmentService.getAppointments(this.doctorId!, this.currentPage - 1, this.itemsPerPage)
      );
      this.formatAndSetAppointments(response, false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  async fetchAppointmentsSearch(): Promise<void> {
    try {
      const response = await this.appointmentService
        .getAppointmentSearch(
          this.currentPage - 1,
          this.filterByHeader,
          this.searchText,
          this.itemsPerPage
        )
        .toPromise();

      this.formatAndSetAppointments(response, true);
    } catch (error) {
      console.error("Error searching appointments:", error);
    }
  }

  private formatAndSetAppointments(response: any, inSearchMode: boolean): void {
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
  async searchAppointments(): Promise<void> {
    try {
      if (this.searchText && this.filterByHeader) {
        this.inSearchMode = true;
        await this.fetchAppointmentsSearch();
        this.totalPages = this.totalPagesSearch;
      } else {
        this.inSearchMode = false;
        await this.fetchAppointments();
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Delete
  // ──────────────────────────────────────────────────────────────
  async deleteAppointment(index: number): Promise<void> {
    try {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Are you sure?",
          message: "Do you really want to delete this Appointment?",
          isConfirm: false,
        },
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

      const appointmentId = this.inSearchMode
        ? this.searchedData[index].appointmentId
        : this.filteredData[index].appointmentId;

      await firstValueFrom(this.appointmentService.deleteAppointment(appointmentId));

      // ✅ Wait for data to reload before showing success message
      if (this.inSearchMode) {
        await this.fetchAppointmentsSearch();
      } else {
        await this.fetchAppointments();
      }

      this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Success",
          message: "The Appointment has been deleted successfully.",
          isConfirm: true,
        },
      });

    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  }
}
