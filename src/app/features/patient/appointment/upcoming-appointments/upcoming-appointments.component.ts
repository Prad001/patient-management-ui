import { ChangeDetectorRef, Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { Header } from 'src/types/header';
import { DeleteDialogComponent } from '../../shared/dialogs/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatService } from '../../shared/service/time-format.service';
import { Appointment } from 'src/types/appointment';
import { AppointmentService } from '../appointment-service';
import { RescheduleDialogComponent } from '../../shared/dialogs/reschedule-dialog/reschedule-dialog.component';

@Component({
  selector: 'app-upcoming-appointments',
  templateUrl: './upcoming-appointments.component.html',
  styleUrls: ['./upcoming-appointments.component.scss']
})
export class UpcomingAppointmentsComponent {
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
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private timeFormatService: TimeFormatService
  ) { }

  // ──────────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.fetchUpcomingAppointments();

    this.searchTextChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((text) => {
        this.searchText = text;
        this.searchUpcomingAppointments();
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
    this.inSearchMode ? this.fetchUpcomingAppointmentsSearch() : this.fetchUpcomingAppointments();
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
      this.resheduleUpcomingAppointment(event.rowIndex, event.rowData.doctorId);
    } else if (event.action === "delete") {
      this.cancelUpcomingAppointment(event.rowIndex);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────────────────────
  async resheduleUpcomingAppointment(index: number, doctorId: string): Promise<void> {
    try {
      // Step 1: Get appointment object
      const appointment = this.inSearchMode
        ? this.searchedData[index]
        : this.filteredData[index];

      // Step 2: Prepare dialog data depending on status
      const isAlreadyRescheduled = appointment.appointmentStatus === 'RESCHEDULED';
      const dialogData = {
        title: isAlreadyRescheduled ? "Info" : "Are you sure?",
        message: isAlreadyRescheduled
          ? "This appointment has already been rescheduled."
          : "Do you really want to reschedule this appointment?",
        isConfirm: isAlreadyRescheduled, // show only OK button if already rescheduled
      };

      const dialogRef = this.dialog.open(RescheduleDialogComponent, {
        data: dialogData,
      });

      const result = await dialogRef.afterClosed().toPromise();

      // If already rescheduled, no action needed
      if (isAlreadyRescheduled || !result) return;

      // Step 3: Call service to update status = RESCHEDULED
      await firstValueFrom(
        this.appointmentService.resheduleUpcomingAppointment(appointment.appointmentId)
      );

      // Step 4: Show success dialog
      this.dialog.open(RescheduleDialogComponent, {
        data: {
          title: "Success",
          message: "The appointment has been rescheduled successfully.",
          isConfirm: true,
        },
      });

      // Step 5: Navigate to booking availability
      this.router.navigate([
        "patient",
        "book-appointment",
        "check-availability",
        { doctorId },
      ]);

    } catch (error) {
      console.error("Error rescheduling appointment:", error);

      this.dialog.open(RescheduleDialogComponent, {
        data: {
          title: "Error",
          message: "Failed to reschedule the appointment. Please try again.",
          isConfirm: true,
        },
      });
    }
  }


  // ──────────────────────────────────────────────────────────────
  // Data Fetching
  // ──────────────────────────────────────────────────────────────
  async fetchUpcomingAppointments(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.appointmentService.getUpcomingAppointments(this.currentPage - 1, this.itemsPerPage)
      );
      this.formatAndSetUpcomingAppointments(response, false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  async fetchUpcomingAppointmentsSearch(): Promise<void> {
    try {
      const response = await this.appointmentService
        .getUpcomingAppointmentSearch(
          this.currentPage - 1,
          this.filterByHeader,
          this.searchText,
          this.itemsPerPage
        )
        .toPromise();

      this.formatAndSetUpcomingAppointments(response, true);
    } catch (error) {
      console.error("Error searching appointments:", error);
    }
  }

  private formatAndSetUpcomingAppointments(response: any, inSearchMode: boolean): void {
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
  async searchUpcomingAppointments(): Promise<void> {
    try {
      if (this.searchText && this.filterByHeader) {
        this.inSearchMode = true;
        await this.fetchUpcomingAppointmentsSearch();
        this.totalPages = this.totalPagesSearch;
      } else {
        this.inSearchMode = false;
        await this.fetchUpcomingAppointments();
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Delete
  // ──────────────────────────────────────────────────────────────
  async cancelUpcomingAppointment(index: number): Promise<void> {
    try {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Are you sure?",
          message: "Do you really want to cancel this appointment?",
          isConfirm: false,
        },
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

      const appointmentId = this.inSearchMode
        ? this.searchedData[index].appointmentId
        : this.filteredData[index].appointmentId;

      // Mark as CANCELLED instead of deleting
      await firstValueFrom(this.appointmentService.cancelUpcomingAppointment(appointmentId));

      // Refresh data
      if (this.inSearchMode) {
        await this.fetchUpcomingAppointmentsSearch();
      } else {
        await this.fetchUpcomingAppointments();
      }

      this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Success",
          message: "The appointment has been cancelled successfully.",
          isConfirm: true,
        },
      });

    } catch (error) {
      console.error("Error cancelling appointment:", error);

      this.dialog.open(DeleteDialogComponent, {
        data: {
          title: "Error",
          message: "Failed to cancel the appointment. Please try again.",
          isConfirm: true,
        },
      });
    }
  }


  back(): void {
    if (this.inSearchMode) {
      this.inSearchMode = false;
    } else {
      this.router.navigate(["patient"]);
    }
  }
}
