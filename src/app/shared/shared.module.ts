import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './pagination/pagination.component';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { MainTableComponent } from './table/main-table/main-table.component';
import { ButtonCellRendererComponent } from './table/table-components/button-cell-renderer/button-cell-renderer.component';
import { RowTooltipComponent } from './table/main-table/row-tooltip.component';
@NgModule({
  declarations: [
    SideNavbarComponent,
    AppNavbarComponent,
    BreadCrumbComponent,
    PaginationComponent,
    MainTableComponent,
    ButtonCellRendererComponent,
    RowTooltipComponent
  ],
  imports: [
    CommonModule,
       MatSidenavModule, 
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    FontAwesomeModule,
    RouterModule,
    AgGridAngular,
    AgGridModule
  ],
  exports: [
    SideNavbarComponent,
    AppNavbarComponent,
    BreadCrumbComponent,
    PaginationComponent,
    ButtonCellRendererComponent,
    MainTableComponent,
    RowTooltipComponent
  ]
})
export class SharedModule { }
