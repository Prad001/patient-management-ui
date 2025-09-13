import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { Doctor } from 'src/types/doctor';
import { BookAppointmentService } from './book-appointment.service';
import { MatDialog } from '@angular/material/dialog';
import { TimeFormatService } from '../../shared/service/time-format.service';
import { Header } from 'src/types/header';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent {
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
    
    isDoctorSelected: boolean = false;
  
    // ─── Data ─────────────────────────────────────────────────────
    doctors: Doctor[] = [];
    filteredData: Doctor[] = [];
    searchedData: Doctor[] = [];
    selectedDoctor: Doctor | null = null; // Store selected doctor
    doctorId: string = '';

      // ─── UI Configuration ─────────────────────────────────────────
      headers: Header[] = [
        
        {
          name: "Doctor Name",
          property: "name",
          showInDropdown: true,
    
        },
        {
          name: "Doctor Role",
          property: "roleCode",
          showInDropdown: true,
    
        },
        {
          name: "Specialization",
          property: "specialization",
          showInDropdown: true,
    
        },
        {
          name: "Qualification",
          property: "qualification",
          showInDropdown: true,
    
        },
        
      ];

       constructor(
         private router: Router,
         private doctorService: BookAppointmentService,
         private dialog: MatDialog,
         private cdr: ChangeDetectorRef,
         private timeFormatService: TimeFormatService
       ) { }


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

  // ──────────────────────────────────────────────────────────────
  // Search
  // ──────────────────────────────────────────────────────────────
async searchDoctors(): Promise<void> {
  try {
    // ❌ If category not selected → reset and show normal list
    if (!this.filterByHeader) {
      this.inSearchMode = false;
      this.searchText = ''; // optional: clear search text
      await this.fetchDoctors();
      return;
    }

    // ❌ If search text empty → reset and show normal list
    if (!this.searchText) {
      this.inSearchMode = false;
      await this.fetchDoctors();
      return;
    }

    // ✅ Valid category & text → search
    this.inSearchMode = true;
    await this.fetchDoctorsSearch();
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
    }
  } catch (error) {
    console.error("Error during search:", error);
  }
}

onCategoryChange(): void {
  this.searchText = '';
  this.inSearchMode = false;
  this.fetchDoctors();
}


  

         
  selectDoctor(doctor: Doctor): void {
    this.isDoctorSelected = true;
     this.selectedDoctor = doctor; // Save to show in UI
    console.log('Selected Doctor:', doctor);
    
  }

  checkAvailability(): void {
     
    // console.log('Booking appointment with:', doctor);
    this.router.navigate([
      'patient/book-appointment/check-availability',
      { doctorId: this.selectedDoctor?.doctorId }
    ]);

  }

  // ──────────────────────────────────────────────────────────────
  // Utility Methods
  // ──────────────────────────────────────────────────────────────
  // getDoctorInitials(name: string): string {
  //   return name
  //     .split(' ')
  //     .map((part) => part.charAt(0).toUpperCase())
  //     .join('');
  // }

  // getDoctorImage(doctor: Doctor): string {
  //   return doctor.image || 'assets/images/default-doctor.png';
  // }
  
  // getDoctorSpecialization(doctor: Doctor): string {
  //   return doctor.specialization || 'General';
  // }
  
  // getDoctorExperience(doctor: Doctor): string {
  //   return doctor.experience ? `${doctor.experience} years` : 'N/A';
  // }

  // getDoctorRating(doctor: Doctor): number {
  //   return doctor.rating || 0;
  // }
  
  // getDoctorAvailability(doctor: Doctor): string {
  //   return doctor.isAvailable ? 'Available' : 'Not Available';
  // }

}
