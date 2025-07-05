import { Component, Input } from '@angular/core';


export interface Breadcrumb {
  label: string;
  url?: string; // optional for the active (last) one
}
@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent {
     @Input() breadcrumbs: Breadcrumb[] = [];
}
