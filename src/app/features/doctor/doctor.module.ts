import { NgModule } from "@angular/core";
import { AppointmentComponent } from "./appointment/appointment.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReportsComponent } from "./reports/reports.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";
import { SlotComponent } from "./slot/slot.component";
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  declarations: [
   AppointmentComponent,
   DashboardComponent,
   ReportsComponent,
   PatientDetailsComponent,
   SlotComponent,
   ScheduleComponent,

   
  ],
  imports: [CommonModule, SharedModule,FormsModule,
        ReactiveFormsModule],
  exports: [],
})
export class DoctorModule {}