import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent {
  @Input() isSidenavOpen = false;
  @Output() toggle = new EventEmitter<void>();

  toggleSidenav() {
    this.toggle.emit();
  }
}
