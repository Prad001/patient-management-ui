import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookAppointmentService } from '../../book-appointment.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

interface Slot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss']
})
export class AppointmentDialogComponent {

   patientID:string='473200ec-69fb-49ae-9c96-2d84c0b53adb';
  
   slots: Slot[] = [];
   selectedSlot: Slot | null = null;
     constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { slotId: string; doctorId: string; date: string },
    private dialogRef: MatDialogRef<AppointmentDialogComponent>,
    private snackBar: MatSnackBar,
    private bookAppointmentService: BookAppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchSlots();
  }

  async fetchSlots(): Promise<void> {
    try {
      const res: Slot[] = await firstValueFrom(
        this.bookAppointmentService.fetchSessionsBySlotAndDate(
          this.data.doctorId,
          this.data.slotId,
          this.data.date
        )
      );
      this.slots = res;
    } catch {
      this.snackBar.open('Failed to load slots', 'Close', { duration: 3000 });
    }
  }

  selectSlot(slot: Slot): void {
    this.selectedSlot = slot;
  }

  async onBook(): Promise<void> {

  try {

    if (!this.selectedSlot) return;

    await firstValueFrom(this.bookAppointmentService.bookAppointment(this.data.doctorId, this.data.slotId, this.data.date,this.patientID,this.selectedSlot.startTime));
      this.snackBar.open('Appointment booked successfully!', 'Close', {
          duration: 3000,
          panelClass: ['bg-success', 'text-white']
        });


        this.router.navigate(['patient/upcoming-appointments']);

        this.dialogRef.close(true);
    
  } catch (error) {
     this.snackBar.open('Failed to book appointment!', 'Close', {
          duration: 3000,
          panelClass: ['bg-danger', 'text-white']
        });
  }   
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
