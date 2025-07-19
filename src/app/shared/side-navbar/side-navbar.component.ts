import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { animate, style, transition, trigger } from '@angular/animations';
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

  constructor(private router: Router) {}

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
      } else if (currentUrl.includes('doctor')) {
        this.setActiveLink('user-management/doctor');
      } else if (currentUrl.includes('patient')) {
        this.setActiveLink('user-management/patient');
      } else {
        this.setActiveLink('dashboardAdmin');
      }
      this.isTitle = 'Adaptive Access Control';
    }
  }

  setActiveLink(link: string): void {
    this.activeLink = link;
  }

  isUserDropdownOpen: boolean = false;

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  dashboardAdmin() {
    this.router.navigate(['admin']);
  }

  // adminUserManagement() {
  //   this.router.navigate(["admin/user-management"]);
  // }

  adminReports() {
    this.router.navigate(['admin/reports']);
  }

  receptionist() {
    this.router.navigate(['admin/user-management/receptionist/search']);
  }

  doctor() {
    this.router.navigate(['admin/user-management/doctor/search']);
  }

  patient() {
    this.router.navigate(['admin/patient']);
  }

  isAdminRouteNavbar(): boolean {
    return this.router.url.includes('/admin');
  }

  closeSidenav() {
    this.sidenavClosed.emit();
  }
}
