import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth-service/auth.service';

@Component({
  selector: 'app-receptionist',
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.scss']
})
export class ReceptionistComponent {
  isSidenavOpen = false;

    constructor(private authService: AuthService) { }

   ngOnInit() {
    const userId = this.authService.getUserId();
    const userEmail = this.authService.getUserEmail();
    const userRole = this.authService.getUserRole();

    console.log('User ID:', userId);
    console.log('Email:', userEmail);
    console.log('Role:', userRole);
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  onSidenavClose() {
    this.isSidenavOpen = false;
  }
}