import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
})
export class SideNavbarComponent {
  @Output() sidenavClosed = new EventEmitter<void>();

  activeLink: string = '';
  isTitle: string = '';
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveLinkBasedOnRoute();
      });

    // Set the active link on initial load
    this.setActiveLinkBasedOnRoute();
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  setActiveLinkBasedOnRoute(): void {
    const currentUrl = this.router.url;

    if (this.isAdminRouteNavbar()) {
      if (currentUrl.includes('reports')) {
        this.setActiveLink('adminReports');
      } else if (currentUrl.includes('receptionist')) {
        this.setActiveLink('user-management/receptionist');
      } else if (this.router.url.startsWith('/admin/user-management/doctor')) {
        this.setActiveLink('user-management/doctor');
      } else if (currentUrl.includes('patient')) {
        this.setActiveLink('user-management/patient');
      } else {
        this.setActiveLink('dashboardAdmin');
      }
      //this.isTitle = 'Adaptive Access Control';
    }

    if (this.isDoctorRouteNavbar()) {
      if (currentUrl.includes('reports')) {
        this.setActiveLink('doctorReports');
      } else if (currentUrl.includes('appointment')) {
        this.setActiveLink('doctorAppointment');
      } else if (currentUrl.includes('slot')) {
        this.setActiveLink('doctorSlot');

      } else if (currentUrl.includes('schedule')) {
        this.setActiveLink('doctorSchedule');

      } else if (currentUrl.includes('patient-details')) {
        this.setActiveLink('doctorPatientDetails');
      } else {
        this.setActiveLink('dashboardDoctor');
      }
      // this.isTitle = 'Doctor Dashboard';
    }
  }

  setActiveLink(link: string): void {
    this.activeLink = link;
  }

  isUserDropdownOpen: boolean = false;

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  //Admin

  dashboardAdmin() {
    this.router.navigate(['admin']);
  }

  adminReports() {
    this.router.navigate(['admin/reports']);
  }

  adminReceptionist() {
    this.router.navigate(['admin/user-management/receptionist/search']);
  }

  adminDoctor() {
    this.router.navigate(['admin/user-management/doctor/search']);
  }

  adminPatient() {
    this.router.navigate(['admin/patient']);
  }
  patient() {
    this.router.navigate(['admin/user-management/patient/search']);
  }


  //Doctor

  dashboardDoctor() {
    this.router.navigate(['doctor']);
  }
  doctorReports() {
    this.router.navigate(['doctor/reports']);
  }
  doctorAppointment() {
    this.router.navigate(['doctor/appointment']);
  }
  doctorSlot() {
    this.router.navigate(['doctor/slot']);
  }
  doctorSchedule() {
    this.router.navigate(['doctor/schedule']);
  }

  doctorPatientDetails() {
    this.router.navigate(['doctor/patient-details']);
  }





  isAdminRouteNavbar(): boolean {
    const url = this.router.url;
    return url.startsWith('/admin') && !url.startsWith('/doctor');
  }

  isDoctorRouteNavbar(): boolean {
    const url = this.router.url;
    return url.startsWith('/doctor');
  }


  closeSidenav() {
    this.sidenavClosed.emit();
  }
}
