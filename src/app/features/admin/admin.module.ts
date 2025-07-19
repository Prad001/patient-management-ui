import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReceptionistCreateOrUpdateComponent } from './user-management/receptionist/receptionist-create-or-update/receptionist-create-or-update.component';
import { ReceptionistSearchComponent } from './user-management/receptionist/receptionist-search/receptionist-search.component';
import { DeleteDialogComponent } from './shared/dialogs/delete-dialog/delete-dialog.component';
import { SuccessDialogComponent } from './shared/dialogs/success-dialog/success-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { DoctorCreateOrUpdateComponent } from './user-management/doctor/doctor-create-or-update/doctor-create-or-update.component';
import { DoctorSearchComponent } from './user-management/doctor/doctor-search/doctor-search.component'; // ✅ ADD THIS


@NgModule({
  declarations: [
    ReceptionistCreateOrUpdateComponent,
    ReceptionistSearchComponent,
    DeleteDialogComponent,
    SuccessDialogComponent,
    DashboardComponent,
    ReportsComponent,
    DoctorCreateOrUpdateComponent,
    DoctorSearchComponent,

  ],
  imports: [CommonModule, SharedModule,FormsModule,
        ReactiveFormsModule],
  exports: [],
})
export class AdminModule {}
